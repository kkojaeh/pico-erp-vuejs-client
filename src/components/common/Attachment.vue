<template>
  <abstract-attachment ref="attachment" v-model="model" :model-type="modelType"
                       :multiple="multiple" :max-file-size="maxFileSize"
                       :max-number-of-files="maxNumberOfFiles" :category="category">
  </abstract-attachment>

</template>

<script>
  import AbstractAttachment from 'src/attachment/AbstractAttachment.vue'
  import {
    AbstractAttachmentModel,
    AttachmentFileModel
  } from 'src/attachment/AbstractAttachmentModel'
  import {api} from 'src/config/axios';
  import * as _ from 'lodash';

  class AttachmentModel extends AbstractAttachmentModel {

    async fetch(id) {
      const response = await api.get(`/attachment/attachments/${id}`, {});
      _.assign(this, response.data);
      return this;
    }

    async create() {
      const response = await api.post('/attachment/attachments', {
        multiple: this.multiple,
        categoryId: this.category
      });
      _.assign(this, response.data);
      return this.id;
    }

    async delete() {
      const id = this.id;
      await api.delete(`/attachment/attachments/${id}`, {});
    }

    get headers() {
      return {
        'X-Firebase-Auth': localStorage.getItem('API_FIREBASE_TOKEN')
      }
    }

    get files() {
      const id = this.id;
      const host = api.defaults.baseURL;
      return this.items.map((item) => {
        return new AttachmentFileModel.Builder(this)
        .id(item.id)
        .name(item.name)
        .size(item.contentLength)
        .thumbnail(`${host}/attachment/thumbnails/${id}/items/${item.id}`)
        .download(`${host}/attachment/attachments/${id}/items/${item.id}`)
        .type(item.contentType)
        .build()
      });
    }

    get uploadUrl() {
      const host = api.defaults.baseURL;
      const id = this.id;
      return `${host}/attachment/attachments/${id}/items`;
    }

    static iconUrl(name, contentType) {
      const host = api.defaults.baseURL;
      if(contentType) {
        return `${host}/attachment/icons/${contentType}`;
      }
      const extension = name.substring(name.lastIndexOf('.'));
      return `${host}/attachment/icons/${extension}`;
    }

    async addFile(file) {
      this.items.push({
        id: file.id,
        name: file.name,
        contentLength: file.size,
        contentType: file.type
      });
    }

    async removeFile(fileId) {
      const id = this.id;
      const item = this.items.find((item) => item.id === fileId);
      if(!item){
        throw Error('not fout item');
      }
      await api.delete(`/attachment/attachments/${id}/items/${item.id}`);
      return `${item.id}`;
    }

  }

  export default {
    props: {
      multiple: {
        type: Boolean,
        default: false
      },
      maxFileSize: {
        type: Number,
        default: 20
      },
      maxNumberOfFiles: {
        type: Number,
        default: 5
      },
      value: {
        type: String
      },
      category: {
        type: String,
        required: true
      }
    },
    components: {
      'abstract-attachment': AbstractAttachment
    },
    data() {
      return {
        model: null,
        modelType: AttachmentModel
      }
    },
    watch: {
      value(to, from) {
        this.model = to;
      },
      model(to, from) {
        this.$emit('input', to);
      }
    },
    methods: {
      async save() {
        return await this.$refs.attachment.save();
      }
    }

  }

</script>
