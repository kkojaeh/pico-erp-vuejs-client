export class AttachmentModel {

  /**
   * 기존에 저장되어 있는 파일을 반환
   * @returns {Array.<AttachmentFileModel>} 파일 모델의 배열
   */
  get files () {
    return []
  }

  /**
   * 업로드 할 URL 을 반환
   * @returns {string} 업로드 URL
   */
  get uploadUrl () {
    return ''
  }

  /**
   * 요청시 전송할 헤더 키와 값
   * @returns {{}} 헤더 키와 값
   */
  get headers () {
    return {}
  }

  /**
   * 이미지 타입이 아닌 이름 에 해당하는 아이콘의 URL 을 반환
   * @param {string} name 파일 이름
   * @returns {string} 아이콘의 URL
   */
  static iconUrlByName (name) {
    return ''
  }

  /**
   * 이미지 타입이 아닌 Content-Type 에 해당하는 아이콘의 URL 을 반환
   * @param {string} contentType 컨텐츠 타입
   * @returns {string} 아이콘의 URL
   */
  static iconUrlByContentType (contentType) {
    return ''
  }

  /**
   * 아이디로 조회하고 자신을 반환한다
   * @param {string} id 조회할 id
   * @returns {Promise.<AttachmentModel>} self
   */
  async fetch (id) {
    return this
  }

  /**
   * 생성후 생성된 아이디를 반환한다
   * @returns {Promise.<string>} 생성된 아이디
   */
  async create () {
    return 'id'
  }

  /**
   * 삭제한다
   * @returns {Promise.<void>} 없음
   */
  async delete () {
  }

  /**
   * 초기화 한다
   * @returns {Promise.<void>} 없음
   */
  async clear () {

  }

  /**
   * 파일 추가
   * @param {AttachmentFileModel} file
   */

  /**
   * 파일 추가
   * @param {AttachmentFileModel} file 파일 객체
   * @returns {Promise.<void>} 없음
   */
  async addFile (file) {

  }

  /**
   * 파일 삭제
   * @param {string} fileId 파일 아이디
   * @returns {Promise.<void>} 없음
   */
  async removeFile (fileId) {

  }

}

export class AttachmentFileModel {

  constructor (builder) {
    this.attachment = builder.attachment
    this.id = builder.id
    this.name = builder.name
    this.size = builder.size
    this.thumbnail = builder.thumbnail
    this.download = builder.download
    this.type = builder.type
    this.onRemove = builder.onRemove
  }

  static get Builder () {
    class Builder {
      constructor (attachment) {
        this.attachment = attachment
      }

      id (id) {
        this.id = id
        return this
      }

      name (name) {
        this.name = name
        return this
      }

      size (size) {
        this.size = size
        return this
      }

      thumbnail (thumbnail) {
        this.thumbnail = thumbnail
        return this
      }

      download (download) {
        this.download = download
        return this
      }

      type (type) {
        this.type = type
        return this
      }

      build () {
        return new AttachmentFileModel(this)
      }
    }

    return Builder
  }

  /**
   * 삭제하고 삭제된 아이디를 리턴
   * @returns {Promise.<string>} 삭제된 파일의 아이디
   */
  async remove () {
    return ''
  }

}

