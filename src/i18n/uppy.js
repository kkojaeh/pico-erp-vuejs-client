/* eslint-disable */
var exports = {}
exports['ko-KR'] = exports.ko = {
  Uppy: {
    strings: {
      youCanOnlyUploadX: {
        0: '%{smart_count} 개의 파일을 업로드 할수 있습니다.',
        1: '%{smart_count} 개의 파일을 업로드 할수 있습니다.'
      },
      youHaveToAtLeastSelectX: {
        0: '적어도 %{smart_count} 개의 파일을 선택해야 합니다.',
        1: '적어도 %{smart_count} 개의 파일을 선택해야 합니다.'
      },
      exceedsSize: '이 파일은 허용된 크기를 초과 했습니다. 최대크기 :',
      youCanOnlyUploadFileTypes: '다음과 같은 유형만 업로드 할수 있습니다. 허용유형 :',
      uppyServerError: '서버 연결에 실패 했습니다.'
    }
  },
  Dashboard: {
    strings: {
      selectToUpload: '업로드할 파일을 선택하세요',
      closeModal: '팝업 닫기',
      upload: '업로드',
      importFrom: '파일 불러오기',
      dashboardWindowTitle: '첨부파일 창 (esc 를 누르면 답힙니다)',
      dashboardTitle: '첨부파일',
      copyLinkToClipboardSuccess: '링크가 클립보드로 복사되었습니다.',
      copyLinkToClipboardFallback: '링크 복사에 실패하였습니다.',
      fileSource: '파일 원본',
      done: '완료',
      localDisk: '내 PC',
      myDevice: '내 장치',
      dropPasteImport: '여기에 파일을 놓거나 붙여넣기 하세요, 하나 또는 그이상의 위치에서 불러오게 됩니다.',
      dropPaste: '여기에 파일을 놓거나 붙여넣기 하세요',
      browse: '찾아보기',
      fileProgress: '파일 진행중입니다',
      numberOfSelectedFiles: '선택한 파일의 숫자',
      uploadAllNewFiles: '새로운 파일을 모두 업로드',
      emptyFolderAdded: '비어있는 폴더에서 추가된 폴더가 없습니다.',
      folderAdded: {
        0: '%{folder} 에서 %{smart_count} 개의 파일이 추가되었습니다.',
        1: '%{folder} 에서 %{smart_count} 개의 파일이 추가되었습니다.'
      }
    }
  },
  DragDrop: {
    strings: {
      dropHereOr: '여기에 파일을 놓으세요 또는',
      browse: '찾아보기'
    }
  },
  StatusBar: {
    strings: {
      uploading: '업로드중',
      uploadComplete: '업로드 완료',
      uploadFailed: '업로드 실패',
      pleasePressRetry: '다시 업로드를 위해 재시도를 누르세요',
      paused: '정지중',
      error: '에러',
      retry: '재시도',
      pressToRetry: '재시도를 누르세요',
      retryUpload: '업로드 재시도',
      resumeUpload: '업로드 재실행',
      cancelUpload: '업로드 취소',
      pauseUpload: '업로드 정지',
      uploadXFiles: {
        0: '%{smart_count} 개의 파일을 업로드',
        1: '%{smart_count} 개의 파일을 업로드'
      },
      uploadXNewFiles: {
        0: '추가된 %{smart_count} 개의 파일을 업로드',
        1: '추가된 %{smart_count} 개의 파일을 업로드'
      }
    }
  },
  Webcam: {
    strings: {
      smile: '웃으세요!'
    }
  }
}
export default exports[navigator.language]