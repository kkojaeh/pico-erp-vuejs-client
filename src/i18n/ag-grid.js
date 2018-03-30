/* eslint-disable */
import { language, languageAliases } from './index'
const exports = {}

exports.ko = {
  // for filter panel
  page: '페이지',
  more: '더',
  to: '으로',
  of: '의',
  next: '다음',
  last: '마지막',
  first: '처음',
  previous: '이',
  loadingOoo: '로딩중...',

  // for set filter
  selectAll: '전체 선택',
  searchOoo: '검색중...',
  blanks: '빈',

  // for number filter and text filter
  filterOoo: '필터...',
  applyFilter: '필터 적용',

  // for number filter
  equals: '동일',
  lessThan: '보다 작은',
  greaterThan: '보다 큰',

  // for text filter
  contains: '포함되는',
  startsWith: '으로 시작하는',
  endsWith: '으로 끝나',

  // the header of the default group column
  group: '그룹',

  // tool panel
  columns: '열',
  rowGroupColumns: '피벗 열',
  rowGroupColumnsEmptyMessage: '열을 그룹으로 드래그 하세요',
  valueColumns: '값 열',
  pivotMode: '피벗 모드',
  groups: '그룹',
  values: '값들',
  pivots: '피벗',
  valueColumnsEmptyMessage: '컬럼을 집계로 드래그 하세요',
  pivotColumnsEmptyMessage: '피벗으로 드래그 하세요',

  // other
  noRowsToShow: '표시할 행이 존재하지 않습니다',

  // enterprise menu
  pinColumn: '고정 열',
  valueAggregation: '값 집계',
  autosizeThiscolumn: '해당 열 자동넓이',
  autosizeAllColumns: '모든 열 자동넓이',
  groupBy: '그룹 처리',
  ungroupBy: '그룹 처리 해제',
  resetColumns: '열 초기화',
  expandAll: '전체 확장',
  collapseAll: '전체 축소',
  toolPanel: '도구 패널',
  export: '내보내기',
  csvExport: 'CSV 내보내기',
  excelExport: 'Excel 내보내기',

  // enterprise menu pinning
  pinLeft: '고정 <<',
  pinRight: '고정 >>',
  noPin: '고정해제 <>',

  // enterprise menu aggregation and status panel
  sum: '합',
  min: '최소',
  max: '최대',
  none: '없음',
  count: '갯수',
  average: '평균',

  // standard menu
  copy: '복사',
  copyWithHeaders: '머릿글과 함께 복사',
  ctrlC: 'ctrl + C',
  paste: '붙임',
  ctrlV: 'ctrl + v'
}
export default languageAliases(exports)[language]
