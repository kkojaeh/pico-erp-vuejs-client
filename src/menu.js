import {language, languageAliases} from 'src/i18n'
import {authenticate} from "src/plugins/auth";

const menu = [
  {
    icon: 'settings',
    label: languageAliases({
      ko: '기준 정보'
    })[language],
    children: [
      {
        icon: 'fas fa-user',
        label: languageAliases({
          ko: '사용자 관리'
        })[language],
        url: '/user',
        authorize: 'hasAnyRole(\'USER_MANAGER\')'
      },
      {
        icon: 'fas fa-users',
        label: languageAliases({
          ko: '그룹 관리'
        })[language],
        url: '/group',
        authorize: 'hasAnyRole(\'USER_MANAGER\')'
      },
      {
        icon: 'fas fa-sitemap',
        label: languageAliases({
          ko: '부서 관리'
        })[language],
        url: '/department',
        authorize: 'hasAnyRole(\'USER_MANAGER\')'
      },
      {
        icon: 'fas fa-building',
        label: languageAliases({
          ko: '회사 관리'
        })[language],
        url: '/company',
        authorize: 'hasAnyRole(\'COMPANY_MANAGER\')'
      },
      {
        icon: 'fas fa-cogs',
        label: languageAliases({
          ko: '설비 관리'
        })[language],
        url: '/facility',
        authorize: 'hasAnyRole(\'FACILITY_MANAGER\')'
      },
      {
        icon: 'calendar_today',
        label: languageAliases({
          ko: '작업일 관리'
        })[language],
        url: '/work-schedule',
        authorize: 'hasAnyRole(\'WORK_SCHEDULE_MANAGER\')'
      },
      {
        icon: 'fas fa-industry',
        label: languageAliases({
          ko: '창고 장소 관리'
        })[language],
        url: '/warehouse-location',
        authorize: 'hasAnyRole(\'WAREHOUSE_MANAGER\')'
      }
    ]
  },
  {
    icon: 'work',
    label: languageAliases({
      ko: '고객'
    })[language],
    children: [
      {
        icon: 'fas fa-building',
        label: languageAliases({
          ko: '프로젝트 관리'
        })[language],
        url: '/project',
        authorize: 'hasAnyRole(\'PROJECT_MANAGER\')'
      },
      {
        icon: 'view_list',
        label: languageAliases({
          ko: '견적 관리'
        })[language],
        url: '/quotation',
        authorize: 'hasAnyRole(\'QUOTATION_MANAGER\')'
      },
      {
        icon: 'receipt',
        label: languageAliases({
          ko: '주문 접수 관리'
        })[language],
        url: '/order-acceptance',
        authorize: 'hasAnyRole(\'ORDER_ACCEPTANCE_MANAGER\')'
      }
    ]
  },
  {
    icon: 'shopping_cart',
    label: languageAliases({
      ko: '품목'
    })[language],
    children: [
      {
        icon: 'fas fa-tags',
        label: languageAliases({
          ko: '품목 분류 관리'
        })[language],
        url: '/item-category',
        authorize: 'hasAnyRole(\'ITEM_MANAGER\', \'ITEM_ACCESSOR\')'
      },
      {
        icon: 'shopping_basket',
        label: languageAliases({
          ko: '품목 관리'
        })[language],
        url: '/item',
        authorize: 'hasAnyRole(\'ITEM_MANAGER\', \'ITEM_ACCESSOR\')'
      }
    ]
  },
  {
    icon: 'fast_forward',
    label: languageAliases({
      ko: '공정'
    })[language],
    children: [
      {
        icon: 'library_books',
        label: languageAliases({
          ko: '공정 유형 관리'
        })[language],
        url: '/process-type',
        authorize: 'hasAnyRole(\'PROCESS_TYPE_MANAGER\')'
      },
      {
        icon: 'show_chart',
        label: languageAliases({
          ko: '공정 관리'
        })[language],
        url: '/process',
        authorize: 'hasAnyRole(\'PROCESS_MANAGER\')'
      }
    ]
  },
  {
    icon: 'shopping_cart',
    label: languageAliases({
      ko: '구매'
    })[language],
    children: [
      {
        icon: 'view_list',
        label: languageAliases({
          ko: '구매 요청 현황'
        })[language],
        url: '/purchase-request/request',
        authorize: 'hasAnyRole(\'PURCHASE_REQUESTER\', \'PURCHASE_REQUEST_MANAGER\')'
      },
      {
        icon: 'call_received',
        label: languageAliases({
          ko: '구매 요청 접수'
        })[language],
        url: '/purchase-request/await-accept',
        authorize: 'hasAnyRole(\'PURCHASE_REQUEST_ACCEPTER\', \'PURCHASE_REQUEST_MANAGER\')'
      }
    ]
  },
  {
    icon: 'fas fa-money-check',
    label: languageAliases({
      ko: '발주'
    })[language],
    children: [
      {
        icon: 'watch_later',
        label: languageAliases({
          ko: '발주 대기 현황'
        })[language],
        url: '/purchase-order/await-order',
        authorize: 'hasAnyRole(\'PURCHASE_ORDER_CHARGER\', \'PURCHASE_ORDER_MANAGER\')'
      },
      {
        icon: 'view_list',
        label: languageAliases({
          ko: '발주 현황'
        })[language],
        url: '/purchase-order/order',
        authorize: 'hasAnyRole(\'PURCHASE_ORDER_CHARGER\', \'PURCHASE_ORDER_MANAGER\')'
      }
    ]
  }
  /*
  ,
  {
    icon: 'fas fa-industry',
    label: languageAliases({
      ko: '창고'
    })[language],
    children: [
      {
        icon: 'compare_arrows',
        label: languageAliases({
          ko: '입/출고 요청'
        })[language],
        url: '/warehouse-transaction-request',
        authorize: 'hasAnyRole(\'WAREHOUSE_MANAGER\', \'WAREHOUSE_TRANSACTION_REQUESTER\')'
      }
    ]
  }
  */
]

export class Menu {

  static getAuthorized() {
    return menu.filter(top => {
      top.children = top.children.filter(child => authenticate(child.authorize))
      return top.children.length > 0
    })
  }

}

