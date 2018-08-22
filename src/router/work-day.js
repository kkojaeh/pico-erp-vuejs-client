let meta = {
  title: '작업일 관리',
  authorize: 'hasAnyRole(\'WORK_DAY_MANAGER\', \'WORK_DAY_ACCESSOR\')'
}

export default [{
  name: 'work-day-calendar',
  path: '/work-day/:categoryId/:year/:month',
  component: () => import('src/pages/work-day/work-day-calendar'),
  meta,
  props: (route) => {
    return {
      year: Number(route.params.year),
      month: Number(route.params.month),
      categoryId: route.params.categoryId
    }
  }
}, {
  name: 'work-day-calendar-no-date',
  path: '/work-day',
  component: () => import('src/pages/work-day/work-day-calendar'),
  meta,
  props: (route) => {
    return {}
  }
}]