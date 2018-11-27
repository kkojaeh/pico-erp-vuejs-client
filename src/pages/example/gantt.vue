<template>
  <q-page class="column fit">
    <div ref="container"></div>
  </q-page>
</template>

<script>
  import moment from 'moment'
  import Highcharts from 'highcharts'

  window.Highcharts = Highcharts

  const dateScaleFormatters = {
    'day'(data) {
      return moment(data.value).format('D(ddd)')
    },
    'week'(data) {
      const start = new Date(data.value)
      const end = new Date(data.value + data.tickPositionInfo.unitRange)
      return moment(start).format('YYYY-MM-DD') + ' ~ ' + moment(end).format('YYYY-MM-DD')
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
      return {

      }
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
                return `${point.way} [${point.process}] ${completed}%`
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
          data: [{
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
          }]
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