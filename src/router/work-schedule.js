let meta = {
  title: '작업일 관리',
  authorize: 'hasAnyRole(\'WORK_SCHEDULE_MANAGER\', \'WORK_SCHEDULE_ACCESSOR\')'
}

export default [{
  name: 'work-schedule-calendar',
  path: '/work-schedule/:categoryId/:year/:month',
  component: () => import('src/pages/work-schedule/work-schedule-calendar'),
  meta,
  props: (route) => {
    return {
      year: Number(route.params.year),
      month: Number(route.params.month),
      categoryId: route.params.categoryId
    }
  }
}, {
  name: 'work-schedule-calendar-no-date',
  path: '/work-schedule',
  component: () => import('src/pages/work-schedule/work-schedule-calendar'),
  meta,
  props: (route) => {
    return {}
  }
}]