import * as _ from 'lodash'
import qs from 'qs'

/*
var result = require('lodash/result');
var defaults = require('lodash/defaults');
var includes = require('lodash/includes');
var assign = require('lodash/assign');
var qs = require('qs');
var mediaType = require('media-type');
var Promise = require('any-promise');
*/

var urlError = function () {
  throw new Error('A "url" property or function must be specified')
}

// Map from CRUD to HTTP for our default `Backbone.sync` implementation.
var methodMap = {
  'create': 'POST',
  'update': 'PUT',
  'patch': 'PATCH',
  'delete': 'DELETE',
  'read': 'GET'
}

export default function (axios) {
  return (method, model, optionsInput) => {
    // Copy the options object. It's using assign instead of clonedeep as an optimization.
    // The only object we could expect in options is headers, which is safely transfered below.
    var options = _.assign({}, optionsInput)
    var type = methodMap[method]
    var headers = {}

    // Default options, unless specified.
    _.defaults(options || (options = {}), {
      emulateHTTP: false,
      emulateJSON: false
    })

    // Default request options.
    var params = {type: type}

    var ajaxConfig = _.result(model, 'ajaxConfig', {})
    var key
    // Combine generated headers with user's headers.
    if (ajaxConfig.headers) {
      for (key in ajaxConfig.headers) {
        headers[key.toLowerCase()] = ajaxConfig.headers[key]
      }
    }
    if (options.headers) {
      for (key in options.headers) {
        headers[key.toLowerCase()] = options.headers[key]
      }
      delete options.headers
    }
    // ajaxConfig has to be merged into params before other options take effect, so it is in fact a 2lvl default
    _.assign(params, ajaxConfig)
    params.headers = headers

    // Ensure that we have a URL.
    if (!options.url) {
      options.url = _.result(model, 'url') || urlError()
    }

    // Ensure that we have the appropriate request data.
    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
      params.json = options.attrs || model.toJSON(options)
    }

    // If passed a data param, we add it to the URL or body depending on request type
    if (options.data && type === 'GET') {
      // make sure we've got a '?'
      options.url += _.includes(options.url, '?') ? '&' : '?'
      options.url += qs.stringify(options.data)
      // delete `data` so `xhr` doesn't use it as a body
      delete options.data
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (options.emulateJSON) {
      params.headers['content-type'] = 'application/x-www-form-urlencoded'
      params.body = params.json ? {model: params.json} : {}
      delete params.json
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
      params.type = 'POST'
      if (options.emulateJSON) params.body._method = type
      params.headers['x-http-method-override'] = type
    }

    // When emulating JSON, we turn the body into a querystring.
    // We do this later to let the emulateHTTP run its course.
    if (options.emulateJSON) {
      params.body = qs.stringify(params.body)
    }

    // Set raw XMLHttpRequest options.
    if (ajaxConfig.xhrFields) {
      var beforeSend = ajaxConfig.beforeSend
      params.beforeSend = function (req) {
        _.assign(req, ajaxConfig.xhrFields)
        if (beforeSend) return beforeSend.apply(this, arguments)
      }
      params.xhrFields = ajaxConfig.xhrFields
    }

    // Turn a jQuery.ajax formatted request into xhr compatible
    params.method = params.type

    var ajaxSettings = _.assign(params, options)

    var request
    // Make the request. The callback executes functions that are compatible
    // With jQuery.ajax's syntax.
    var promise = new Promise(function (resolve, reject) {
      request = axios.request(ajaxSettings).then(resp => {
        if (options.success) {
          options.success(resp.data, 'success', resp)
        }
        resolve(resp.data)
      }).catch(err => {
        let body
        let resp = err.response
        if (options.error) {
          try {
            body = JSON.parse(err)
          }
          catch (e) {}
          var message = (err ? err.message : (body || 'HTTP' + resp.statusCode))
          options.error(resp, 'error', message)
        }
        reject(_.assign({}, err, {resp: resp}))
      })
      /*
      request = options.xhrImplementation(ajaxSettings, function (err, resp, body) {
        if (err || resp.statusCode >= 400) {
          if (options.error) {
            try {
              body = JSON.parse(body)
            } catch (e) {}
            var message = (err ? err.message : (body || 'HTTP' + resp.statusCode))
            options.error(resp, 'error', message)
          }
          reject(assign({}, err, {resp: resp}))
        } else {

          // options.always is deliberately not implemented as it can be easily implemented with promise
        }
      })
      */
    })
    request.ajaxSettings = ajaxSettings
    if (model) model.trigger('request', model, request, optionsInput, ajaxSettings)
    // attach request to promise
    promise.request = request
    return promise
  }
}
