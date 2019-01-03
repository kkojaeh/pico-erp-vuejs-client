<template>
  <q-page class="column fit">
    <div ref="container"></div>
  </q-page>
</template>

<script>
  import moment from 'moment'
  import Highcharts from 'highcharts'

  const plans = [{
    "id": "6977588a-c6bd-474c-a696-23a539d78e43",
    "groupId": null,
    "planId": "ae1e85a4-816e-30c8-b61f-4d300081a163",
    "name": "페트 PET-S",
    "itemId": "2ba94dc5-a6e0-3bb2-837b-0018095d9d17",
    "processId": null,
    "processPreparationId": null,
    "itemSpecId": null,
    "quantity": 44.00000,
    "spareQuantity": 1.33320,
    "plannedQuantity": 45.33320,
    "progressedQuantity": 0,
    "startDate": "2018-12-21T22:48:00+09:00",
    "endDate": "2018-12-22T13:12:00+09:00",
    "progressCompanyId": null,
    "completedDate": null,
    "chargerId": null,
    "progressType": null,
    "status": "CREATED",
    "determinedDate": null,
    "canceledDate": null,
    "order": 0,
    "dependencies": []
  }, {
    "id": "a61df93a-4a9c-4780-b682-c670f63b3f2d",
    "groupId": null,
    "planId": "ae1e85a4-816e-30c8-b61f-4d300081a163",
    "name": "식모-뉴안티시린(P)",
    "itemId": "f4944176-4ce5-34a2-aa04-50684e57f5fe",
    "processId": null,
    "processPreparationId": null,
    "itemSpecId": null,
    "quantity": 220.00000,
    "spareQuantity": 2.20000,
    "plannedQuantity": 222.20000,
    "progressedQuantity": 0,
    "startDate": "2018-12-24T22:48:00+09:00",
    "endDate": "2018-12-25T13:12:00+09:00",
    "progressCompanyId": null,
    "completedDate": null,
    "chargerId": null,
    "progressType": null,
    "status": "CREATED",
    "determinedDate": null,
    "canceledDate": null,
    "order": 0,
    "dependencies": []
  }, {
    "id": "95005c66-c074-495c-8487-91eece4f69e4",
    "groupId": null,
    "planId": "ae1e85a4-816e-30c8-b61f-4d300081a163",
    "name": "원지 SC",
    "itemId": "cc2432ae-2b13-30b7-9b38-5938b8654c7f",
    "processId": null,
    "processPreparationId": null,
    "itemSpecId": null,
    "quantity": 11.00000,
    "spareQuantity": 0.56111,
    "plannedQuantity": 11.56111,
    "progressedQuantity": 0,
    "startDate": "2018-12-21T22:48:00+09:00",
    "endDate": "2018-12-22T13:12:00+09:00",
    "progressCompanyId": null,
    "completedDate": null,
    "chargerId": null,
    "progressType": null,
    "status": "CREATED",
    "determinedDate": null,
    "canceledDate": null,
    "order": 0,
    "dependencies": []
  }, {
    "id": "728e228b-59bf-41e3-8221-1f730b78245a",
    "groupId": null,
    "planId": "ae1e85a4-816e-30c8-b61f-4d300081a163",
    "name": "식모-뉴안티시린(O)",
    "itemId": "b777eb6b-c8b3-3892-892c-e65d1a93f486",
    "processId": null,
    "processPreparationId": null,
    "itemSpecId": null,
    "quantity": 220.00000,
    "spareQuantity": 2.20000,
    "plannedQuantity": 222.20000,
    "progressedQuantity": 0,
    "startDate": "2018-12-24T22:48:00+09:00",
    "endDate": "2018-12-25T13:12:00+09:00",
    "progressCompanyId": null,
    "completedDate": null,
    "chargerId": null,
    "progressType": null,
    "status": "CREATED",
    "determinedDate": null,
    "canceledDate": null,
    "order": 0,
    "dependencies": []
  }, {
    "id": "367f88ab-699f-4157-af35-1a99ae5c22e0",
    "groupId": null,
    "planId": "ae1e85a4-816e-30c8-b61f-4d300081a163",
    "name": "원지 IV",
    "itemId": "08e90971-4af5-340e-89e1-926620497ffc",
    "processId": null,
    "processPreparationId": null,
    "itemSpecId": null,
    "quantity": 27.50000,
    "spareQuantity": 1.11650,
    "plannedQuantity": 28.61650,
    "progressedQuantity": 0,
    "startDate": "2018-12-21T22:48:00+09:00",
    "endDate": "2018-12-22T13:12:00+09:00",
    "progressCompanyId": null,
    "completedDate": null,
    "chargerId": null,
    "progressType": null,
    "status": "CREATED",
    "determinedDate": null,
    "canceledDate": null,
    "order": 0,
    "dependencies": []
  }, {
    "id": "c23ba1e1-0cd3-436d-a12c-22060442a5b6",
    "groupId": null,
    "planId": "ae1e85a4-816e-30c8-b61f-4d300081a163",
    "name": "식모-뉴안티시린(B)",
    "itemId": "27c064c8-9bd5-357a-91a0-a49b11dc6d65",
    "processId": null,
    "processPreparationId": null,
    "itemSpecId": null,
    "quantity": 220.00000,
    "spareQuantity": 2.20000,
    "plannedQuantity": 222.20000,
    "progressedQuantity": 0,
    "startDate": "2018-12-24T22:48:00+09:00",
    "endDate": "2018-12-25T13:12:00+09:00",
    "progressCompanyId": null,
    "completedDate": null,
    "chargerId": null,
    "progressType": null,
    "status": "CREATED",
    "determinedDate": null,
    "canceledDate": null,
    "order": 0,
    "dependencies": []
  }, {
    "id": "0fa2d01a-c679-4c58-8ef2-a94598d665b0",
    "groupId": null,
    "planId": "ae1e85a4-816e-30c8-b61f-4d300081a163",
    "name": "SK.K E골",
    "itemId": "a84ee088-fadf-3dd6-8701-1ce2db9bdbac",
    "processId": null,
    "processPreparationId": null,
    "itemSpecId": null,
    "quantity": 7.12800,
    "spareQuantity": 0.36360,
    "plannedQuantity": 7.49160,
    "progressedQuantity": 0,
    "startDate": "2018-12-21T22:48:00+09:00",
    "endDate": "2018-12-22T13:12:00+09:00",
    "progressCompanyId": null,
    "completedDate": null,
    "chargerId": null,
    "progressType": null,
    "status": "CREATED",
    "determinedDate": null,
    "canceledDate": null,
    "order": 0,
    "dependencies": []
  }, {
    "id": "02387b74-5404-4f8b-9b4e-aa3e9e34c0c8",
    "groupId": null,
    "planId": "ae1e85a4-816e-30c8-b61f-4d300081a163",
    "name": "식모-뉴안티시린(Black)",
    "itemId": "3f92d52d-c4b4-3509-8938-972d982ef7c6",
    "processId": null,
    "processPreparationId": null,
    "itemSpecId": null,
    "quantity": 220.00000,
    "spareQuantity": 2.20000,
    "plannedQuantity": 222.20000,
    "progressedQuantity": 0,
    "startDate": "2018-12-24T22:48:00+09:00",
    "endDate": "2018-12-25T13:12:00+09:00",
    "progressCompanyId": null,
    "completedDate": null,
    "chargerId": null,
    "progressType": null,
    "status": "CREATED",
    "determinedDate": null,
    "canceledDate": null,
    "order": 0,
    "dependencies": []
  }, {
    "id": "ba7ccf53-43a5-44d4-a61a-577e4dd35411",
    "groupId": null,
    "planId": "ae1e85a4-816e-30c8-b61f-4d300081a163",
    "name": "공정 인쇄(UV) : 카드-안티시린항균완전미세모Ⅲ8입(접이식)+간지",
    "itemId": "4230537c-26eb-3fc3-bc50-08a9938883ea",
    "processId": "70e45bac-2b0c-386d-8e4b-456e53e27967",
    "processPreparationId": null,
    "itemSpecId": null,
    "quantity": 110.00000,
    "spareQuantity": 1.10000,
    "plannedQuantity": 111.10000,
    "progressedQuantity": 0,
    "startDate": "2018-12-22T16:48:00+09:00",
    "endDate": "2018-12-23T07:12:00+09:00",
    "progressCompanyId": null,
    "completedDate": null,
    "chargerId": null,
    "progressType": null,
    "status": "CREATED",
    "determinedDate": null,
    "canceledDate": null,
    "order": 1,
    "dependencies": ["367f88ab-699f-4157-af35-1a99ae5c22e0"]
  }, {
    "id": "b1339fe3-61eb-4604-89b3-edd5d3e77c40",
    "groupId": null,
    "planId": "ae1e85a4-816e-30c8-b61f-4d300081a163",
    "name": "공정 성형(압착) : PET-안티시린항균완전미세모Ⅲ8입(접이식)",
    "itemId": "6328adef-9feb-3ee0-a848-efa72d701032",
    "processId": "f2dc48c0-0ae9-3b0e-acd6-8b40207353a2",
    "processPreparationId": null,
    "itemSpecId": null,
    "quantity": 110.00000,
    "spareQuantity": 1.10000,
    "plannedQuantity": 111.10000,
    "progressedQuantity": 0,
    "startDate": "2018-12-22T16:48:00+09:00",
    "endDate": "2018-12-23T07:12:00+09:00",
    "progressCompanyId": null,
    "completedDate": null,
    "chargerId": null,
    "progressType": null,
    "status": "CREATED",
    "determinedDate": null,
    "canceledDate": null,
    "order": 1,
    "dependencies": ["6977588a-c6bd-474c-a696-23a539d78e43"]
  }, {
    "id": "0ffe113c-b691-46e3-9e0e-08d16e3a6947",
    "groupId": null,
    "planId": "ae1e85a4-816e-30c8-b61f-4d300081a163",
    "name": "공정 인쇄(옵셋/전지) : 박스-안티시린항균완전미세모Ⅲ8입(10)",
    "itemId": "04ec43e6-3202-3759-b390-c07e9a9ed578",
    "processId": "096b09d8-fd46-3643-ab36-8dc9978b190d",
    "processPreparationId": null,
    "itemSpecId": null,
    "quantity": 11.00000,
    "spareQuantity": 0.11000,
    "plannedQuantity": 11.11000,
    "progressedQuantity": 0,
    "startDate": "2018-12-22T16:48:00+09:00",
    "endDate": "2018-12-23T07:12:00+09:00",
    "progressCompanyId": null,
    "completedDate": null,
    "chargerId": null,
    "progressType": null,
    "status": "CREATED",
    "determinedDate": null,
    "canceledDate": null,
    "order": 1,
    "dependencies": ["0fa2d01a-c679-4c58-8ef2-a94598d665b0", "95005c66-c074-495c-8487-91eece4f69e4"]
  }, {
    "id": "0fbe9e69-9568-4c82-8ef3-d13fd5ac5c4a",
    "groupId": null,
    "planId": "ae1e85a4-816e-30c8-b61f-4d300081a163",
    "name": "공정 코팅(접착) : 카드-안티시린항균완전미세모Ⅲ8입(접이식)+간지",
    "itemId": "4230537c-26eb-3fc3-bc50-08a9938883ea",
    "processId": "6b010afb-ccff-3dd1-bed4-78027d9ca4f8",
    "processPreparationId": null,
    "itemSpecId": null,
    "quantity": 110.00000,
    "spareQuantity": 1.10000,
    "plannedQuantity": 111.10000,
    "progressedQuantity": 0,
    "startDate": "2018-12-23T10:48:00+09:00",
    "endDate": "2018-12-24T01:12:00+09:00",
    "progressCompanyId": null,
    "completedDate": null,
    "chargerId": null,
    "progressType": null,
    "status": "CREATED",
    "determinedDate": null,
    "canceledDate": null,
    "order": 2,
    "dependencies": ["ba7ccf53-43a5-44d4-a61a-577e4dd35411"]
  }, {
    "id": "7c781978-1e97-4a20-ad00-b12857eda2f3",
    "groupId": null,
    "planId": "ae1e85a4-816e-30c8-b61f-4d300081a163",
    "name": "공정 커팅(성형) : PET-안티시린항균완전미세모Ⅲ8입(접이식)",
    "itemId": "6328adef-9feb-3ee0-a848-efa72d701032",
    "processId": "9dc9fa91-d3d4-3866-9de7-4ef80c0a0cbc",
    "processPreparationId": null,
    "itemSpecId": null,
    "quantity": 110.00000,
    "spareQuantity": 1.10000,
    "plannedQuantity": 111.10000,
    "progressedQuantity": 0,
    "startDate": "2018-12-23T10:48:00+09:00",
    "endDate": "2018-12-24T01:12:00+09:00",
    "progressCompanyId": null,
    "completedDate": null,
    "chargerId": null,
    "progressType": null,
    "status": "CREATED",
    "determinedDate": null,
    "canceledDate": null,
    "order": 2,
    "dependencies": ["b1339fe3-61eb-4604-89b3-edd5d3e77c40"]
  }, {
    "id": "0221b62b-8f03-48ca-a0a4-844193feb151",
    "groupId": null,
    "planId": "ae1e85a4-816e-30c8-b61f-4d300081a163",
    "name": "공정 합지(단면) : 박스-안티시린항균완전미세모Ⅲ8입(10)",
    "itemId": "04ec43e6-3202-3759-b390-c07e9a9ed578",
    "processId": "e4f416b2-2b35-353f-930a-e12fcc13d6ab",
    "processPreparationId": null,
    "itemSpecId": null,
    "quantity": 11.00000,
    "spareQuantity": 0.11000,
    "plannedQuantity": 11.11000,
    "progressedQuantity": 0,
    "startDate": "2018-12-23T10:48:00+09:00",
    "endDate": "2018-12-24T01:12:00+09:00",
    "progressCompanyId": null,
    "completedDate": null,
    "chargerId": null,
    "progressType": null,
    "status": "CREATED",
    "determinedDate": null,
    "canceledDate": null,
    "order": 2,
    "dependencies": ["0ffe113c-b691-46e3-9e0e-08d16e3a6947"]
  }, {
    "id": "48cc112c-949b-45d4-944e-6866880671da",
    "groupId": null,
    "planId": "ae1e85a4-816e-30c8-b61f-4d300081a163",
    "name": "공정 톰슨(전면) : 박스-안티시린항균완전미세모Ⅲ8입(10)",
    "itemId": "04ec43e6-3202-3759-b390-c07e9a9ed578",
    "processId": "31bb3060-30d6-3173-b499-bb550baeb3ac",
    "processPreparationId": null,
    "itemSpecId": null,
    "quantity": 11.00000,
    "spareQuantity": 0.11000,
    "plannedQuantity": 11.11000,
    "progressedQuantity": 0,
    "startDate": "2018-12-24T04:48:00+09:00",
    "endDate": "2018-12-24T19:12:00+09:00",
    "progressCompanyId": null,
    "completedDate": null,
    "chargerId": null,
    "progressType": null,
    "status": "CREATED",
    "determinedDate": null,
    "canceledDate": null,
    "order": 3,
    "dependencies": ["0221b62b-8f03-48ca-a0a4-844193feb151"]
  }, {
    "id": "01549e34-cc77-416b-96aa-aa30661c4fa5",
    "groupId": null,
    "planId": "ae1e85a4-816e-30c8-b61f-4d300081a163",
    "name": "공정 톰슨(전면) : 카드-안티시린항균완전미세모Ⅲ8입(접이식)+간지",
    "itemId": "4230537c-26eb-3fc3-bc50-08a9938883ea",
    "processId": "1a0c279a-941e-3474-b5dc-4dbde872d71e",
    "processPreparationId": null,
    "itemSpecId": null,
    "quantity": 110.00000,
    "spareQuantity": 1.10000,
    "plannedQuantity": 111.10000,
    "progressedQuantity": 0,
    "startDate": "2018-12-24T04:48:00+09:00",
    "endDate": "2018-12-24T19:12:00+09:00",
    "progressCompanyId": null,
    "completedDate": null,
    "chargerId": null,
    "progressType": null,
    "status": "CREATED",
    "determinedDate": null,
    "canceledDate": null,
    "order": 3,
    "dependencies": ["0fbe9e69-9568-4c82-8ef3-d13fd5ac5c4a"]
  }, {
    "id": "acd96674-77f2-4015-b116-f0c60855afaf",
    "groupId": null,
    "planId": "ae1e85a4-816e-30c8-b61f-4d300081a163",
    "name": "공정 접착(3면) : 박스-안티시린항균완전미세모Ⅲ8입(10)",
    "itemId": "04ec43e6-3202-3759-b390-c07e9a9ed578",
    "processId": "bb6ac4b1-1455-34eb-b42a-c135967f8da9",
    "processPreparationId": null,
    "itemSpecId": null,
    "quantity": 11.00000,
    "spareQuantity": 0.11000,
    "plannedQuantity": 11.11000,
    "progressedQuantity": 0,
    "startDate": "2018-12-24T22:48:00+09:00",
    "endDate": "2018-12-25T13:12:00+09:00",
    "progressCompanyId": null,
    "completedDate": null,
    "chargerId": null,
    "progressType": null,
    "status": "CREATED",
    "determinedDate": null,
    "canceledDate": null,
    "order": 4,
    "dependencies": ["48cc112c-949b-45d4-944e-6866880671da"]
  }, {
    "id": "8c9707cc-7924-49fb-85b7-be7f32e057d8",
    "groupId": null,
    "planId": "ae1e85a4-816e-30c8-b61f-4d300081a163",
    "name": "공정 포장(칫솔/8입) : 안티시린항균완전미세모Ⅲ8입(10)",
    "itemId": "adee359c-74b1-3498-853c-1332573da016",
    "processId": "adee359c-74b1-3498-853c-1332573da016",
    "processPreparationId": null,
    "itemSpecId": null,
    "quantity": 100,
    "spareQuantity": 10,
    "plannedQuantity": 110,
    "progressedQuantity": 0,
    "startDate": "2018-12-25T16:48:00+09:00",
    "endDate": "2018-12-26T07:12:00+09:00",
    "progressCompanyId": null,
    "completedDate": null,
    "chargerId": null,
    "progressType": null,
    "status": "CREATED",
    "determinedDate": null,
    "canceledDate": null,
    "order": 5,
    "dependencies": ["c23ba1e1-0cd3-436d-a12c-22060442a5b6", "01549e34-cc77-416b-96aa-aa30661c4fa5",
      "a61df93a-4a9c-4780-b682-c670f63b3f2d", "acd96674-77f2-4015-b116-f0c60855afaf",
      "02387b74-5404-4f8b-9b4e-aa3e9e34c0c8", "7c781978-1e97-4a20-ad00-b12857eda2f3",
      "728e228b-59bf-41e3-8221-1f730b78245a"]
  }]

  const datas = plans.map(plan => {
    plan.start = Date.parse(plan.startDate)
    plan.end = Date.parse(plan.endDate)
    plan.dependency = plan.dependencies
    return plan
  })

  datas.forEach(data => {
    datas.filter(d => data.dependency.includes(d.id))
    .forEach(d => d.parent = data.id)
  })

  console.log(datas)

  window.Highcharts = Highcharts

  const dateScaleFormatters = {
    'day'(data) {
      return moment(data.value).format('D(ddd)')
    },
    'week'(data) {
      const start = new Date(data.value)
      const end = new Date(data.value + data.tickPositionInfo.unitRange)
      return moment(start).format('YYYY-MM-DD') + ' ~ ' + moment(end).format('YYYY-MM-DD')
    },
    'hour'(data) {
      const start = new Date(data.value)
      return moment(start).format('HH')
    }
  }

  function xAxisLabelFormatter() {
    return dateScaleFormatters[this.tickPositionInfo.unitName](this)
  }

  const resources = [{
    id: 'r-1',
  }]

  export default {
    name: 'app',
    components: {},
    data() {
      return {}
    },
    mounted() {
      var today = new Date(),
          day = 1000 * 60 * 60 * 24,
          each = Highcharts.each,
          reduce = Highcharts.reduce,
          btnShowDialog = document.getElementById('btnShowDialog'),
          btnRemoveTask = document.getElementById('btnRemoveSelected'),
          btnAddTask = document.getElementById('btnAddTask'),
          btnCancelAddTask = document.getElementById('btnCancelAddTask'),
          addTaskDialog = document.getElementById('addTaskDialog'),
          inputName = document.getElementById('inputName'),
          selectDepartment = document.getElementById('selectDepartment'),
          selectDependency = document.getElementById('selectDependency'),
          chkMilestone = document.getElementById('chkMilestone'),
          isAddingTask = false;

// Set to 00:00:00:000 today
      today.setUTCHours(0);
      today.setUTCMinutes(0);
      today.setUTCSeconds(0);
      today.setUTCMilliseconds(0);
      today.getTime();

// Update disabled status of the remove button, depending on whether or not we
// have any selected points.
      function updateRemoveButtonStatus() {
        debugger
        /*var chart = this.series.chart;
        // Run in a timeout to allow the select to update
        setTimeout(function () {
          btnRemoveTask.disabled = !chart.getSelectedPoints().length ||
              isAddingTask;
        }, 10);*/
        console.log('updateRemoveButtonStatus')
      }

// Create the chart
      var chart = Highcharts.ganttChart(this.$refs.container, {

        chart: {
          spacingLeft: 1
        },

        title: {
          text: 'Interactive Gantt Chart'
        },

        subtitle: {
          text: 'Drag and drop points to edit'
        },

        plotOptions: {
          series: {
            animation: false, // Do not animate dependency connectors
            dragDrop: {
              draggableX: true,
              draggableY: true,
              dragPrecisionX: day / 3 // Snap to eight hours
            },
            dataLabels: {
              enabled: true,
              formatter: function () {
                const point = this.point
                const completed = (point.completed || 0) * 100
                return `${point.name} ${completed}%`
              },
              style: {
                cursor: 'default',
                pointerEvents: 'none'
              }
            },
            allowPointSelect: true,
            point: {
              events: {
                select: updateRemoveButtonStatus,
                unselect: updateRemoveButtonStatus,
                remove: updateRemoveButtonStatus
              }
            },
            tooltip: {
              xDateFormat: "%Y-%m-%d %H:%M"
            }
          }
        },

        /* yAxis: {
           type: 'category',
           categories: ['Tech', 'Marketing', 'Sales'],
           min: 0,
           max: 2
         },
 */
        xAxis: [{
          //currentDateIndicator: true,
          labels: {
            formatter: xAxisLabelFormatter
          }
        }, {
          //currentDateIndicator: true,
          labels: {
            formatter: xAxisLabelFormatter
          }
        }],

        tooltip: {
          xDateFormat: '%a %b %d, %H:%M'
        },

        series: [{
          name: '생산 계획',
          data: datas/*

              [{
            name: '뉴항균닥터클리오일반모4+4입(24)',
            way: '생산',
            process: '포장(스티커)',
            id: '1',
            dependency: ['2', '3', '9'],
            start: today.getTime() + (7 * day),
            end: today.getTime() + (8 * day),
          }, {
            name: '크리오 1SET더 스티커[1]',
            way: '입고',
            process: 'N/A',
            id: '2',
            start: today.getTime(),
            end: today.getTime() + (5 * day)
          }, {
            name: '뉴항균닥터클리오일반모4입(13) - 내부',
            way: '생산',
            process: '포장(삽입)',
            id: '3',
            dependency: ['4', '5', '6', '7', '8'],
            start: today.getTime() + (3 * day),
            end: today.getTime() + (7 * day)
          }, {
            name: '뉴항균닥터클리오일반모4입(13) - 부업',
            way: '생산',
            process: '포장(삽입)',
            id: '11',
            dependency: ['4', '5', '6', '7', '8'],
            start: today.getTime() + (3 * day),
            end: today.getTime() + (7 * day)
          }, {
            name: '포장-뉴닥터항균SC모(B) - 에이스팩',
            way: '입고',
            process: 'N/A',
            id: '4',
            start: today.getTime(),
            end: today.getTime() + (2 * day),
            completed: 1
          }, {
            name: '포장-뉴닥터항균SC모(B) - 동대문',
            way: '입고',
            process: 'N/A',
            id: '5',
            start: today.getTime() + (3 * day),
            end: today.getTime() + (4 * day),
            completed: 1
          }, {
            name: '포장-뉴닥터항균SC모(P)',
            way: '입고',
            process: 'N/A',
            id: '5',
            start: today.getTime(),
            end: today.getTime() + (2 * day),
            completed: 1,
            percentage: 100
          }, {
            name: '포장-뉴닥터항균SC모(G)',
            way: '입고',
            process: 'N/A',
            id: '6',
            start: today.getTime(),
            end: today.getTime() + (2 * day),
            completed: 1,
            percentage: 100
          }, {
            name: '포장-뉴닥터항균SC모(V)',
            way: '입고',
            process: 'N/A',
            id: '7',
            start: today.getTime(),
            end: today.getTime() + (2 * day),
            completed: 1,
            percentage: 100
          }, {
            name: '비닐-항균닥터클리오(뉴) 4입',
            way: '입고',
            process: 'N/A',
            id: '8',
            start: today.getTime() + (1 * day),
            end: today.getTime() + (3 * day),
            completed: 0.5,
            percentage: 50
          }, {
            name: '박스-뉴항균닥터클리오4입1+1(24',
            way: '입고',
            process: 'N/A',
            id: '9',
            start: today.getTime() + (3 * day),
            end: today.getTime() + (5 * day)
          }]*/
          /*


                      {
                      name: 'Layout',
                      id: 'layout',
                      parent: 'design',
                      start: today.getTime() + (3 * day),
                      end: today.getTime() + (10 * day)
                    }, {
                      name: 'Graphics',
                      parent: 'design',
                      dependency: 'layout',
                      start: today.getTime() + (10 * day),
                      end: today.getTime() + (20 * day)
                    }, {
                      name: 'Develop',
                      id: 'develop',
                      start: today.getTime() + (5 * day),
                      end: today.getTime() + (30 * day)
                    }, {
                      name: 'Create unit tests',
                      id: 'unit_tests',
                      dependency: 'requirements',
                      parent: 'develop',
                      start: today.getTime() + (5 * day),
                      end: today.getTime() + (8 * day)
                    }, {
                      name: 'Implement',
                      id: 'implement',
                      dependency: 'unit_tests',
                      parent: 'develop',
                      start: today.getTime() + (8 * day),
                      end: today.getTime() + (30 * day)
                    }]*/
        }]
      });

      window.gantt = chart

      /* Add button handlers for add/remove tasks */
      /*
            btnRemoveTask.onclick = function () {
              var points = chart.getSelectedPoints();
              each(points, function (point) {
                point.remove();
              });
            };

            btnShowDialog.onclick = function () {
              // Update dependency list
              var depInnerHTML = '<option value=""></option>';
              each(chart.series[0].points, function (point) {
                depInnerHTML += '<option value="' + point.id + '">' + point.name +
                    ' </option>';
              });
              selectDependency.innerHTML = depInnerHTML;

              // Show dialog by removing "hidden" class
              addTaskDialog.className = 'overlay';
              isAddingTask = true;

              // Focus name field
              inputName.value = '';
              inputName.focus();
            };

            btnAddTask.onclick = function () {
              // Get values from dialog
              var series = chart.series[0],
                  name = inputName.value,
                  undef,
                  dependency = chart.get(
                      selectDependency.options[selectDependency.selectedIndex].value
                  ),
                  y = parseInt(
                      selectDepartment.options[selectDepartment.selectedIndex].value,
                      10
                  ),
                  maxEnd = reduce(series.points, function (acc, point) {
                    return point.y === y && point.end ? Math.max(acc, point.end) : acc;
                  }, 0),
                  milestone = chkMilestone.checked || undef;

              // Empty category
              if (maxEnd === 0) {
                maxEnd = today;
              }

              // Add the point
              series.addPoint({
                start: maxEnd + (milestone ? day : 0),
                end: milestone ? undef : maxEnd + day,
                y: y,
                name: name,
                dependency: dependency ? dependency.id : undef,
                milestone: milestone
              });

              // Hide dialog
              addTaskDialog.className += ' hidden';
              isAddingTask = false;
            };

            btnCancelAddTask.onclick = function () {
              // Hide dialog
              addTaskDialog.className += ' hidden';
              isAddingTask = false;
            };*/
    }
  }
</script>
<style lang="stylus">
  .dhtmlx-gantt-container
    .saturday
      background: #add8e6aa
    .sunday
      background: #ffb6c1aa
    .gantt_selected
      .sunday
        background: #f7eb91
</style>