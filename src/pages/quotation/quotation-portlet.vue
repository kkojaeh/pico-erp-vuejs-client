<template>
  <div class="fit">
    <q-resize-observable @resize="_onResize"/>
    <div ref="chartContainer">
    </div>
  </div>
</template>
<script>
  import Highcharts from 'highcharts'
  import {
    QuotationStatusArray,
    QuotationStatusCountPerMonthAggregateArray,
    QuotationStatusCountPerMonthAggregateOptions
  } from 'src/model/quotation'
  import moment from 'moment'
  //import Exporting from 'highcharts/modules/exporting';
  //Exporting(Highcharts);

  export default {
    props: {},
    data () {
      return {
        options: new QuotationStatusCountPerMonthAggregateOptions(),
        array: new QuotationStatusCountPerMonthAggregateArray(),
        statusLabels: new QuotationStatusArray(),
      }
    },
    async mounted () {
      await this.statusLabels.fetch()
      await this.array.fetch(this.options)
      this.array.sort(function (a, b) {
        return a.yearMonth - b.yearMonth
      })
      this.array.forEach(item => {
        item.monthName = moment(item.yearMonth, 'YYYYMM').format('MMM')
        item.statusName = this.statusLabels.find(status => status.value == item.status).label
      })
      this.createChart()
    },
    beforeDestroy () {
      if (this.chart) {
        this.chart.destroy()
        this.chart = null
      }
    },
    methods: {
      _onResize (size) {
        if (this.chart) {
          this.chart.setSize(size.width, size.height)
        }
      },
      createChart () {
        const series = this.statusLabels.map(status => {
          const data = this.array.filter(item => item.status == status.value)
          .map(item => item.count)
          return {
            name: status.label,
            data: data,
            tooltip: {
              valueSuffix: ' 건'
            }

          }
        })
        this.chart = Highcharts.chart(this.$refs.chartContainer, {
          chart: {
            type: 'column'
          },
          title: {
            text: '견적 진행 상황'
          },
          xAxis: [{
            categories: this.array.map(item => item.monthName),
            crosshair: true
          }],
          yAxis: [{ // Secondary yAxis
            title: {
              text: '진행 건수',
            },
            stackLabels: {
              enabled: true,
              style: {
                fontWeight: 'bold',
                color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
              }
            }
          }],
          tooltip: {
            shared: true
          },
          plotOptions: {
            column: {
              stacking: 'normal',
              dataLabels: {
                enabled: true,
                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
              }
            }
          },
          // legend: {
          //   layout: 'vertical',
          //   align: 'left',
          //   x: 120,
          //   verticalAlign: 'top',
          //   y: 100,
          //   floating: true,
          //   backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor)
          //   || '#FFFFFF'
          // },
          series: series
        })
      }
    },
    computed: {},
    watch: {},
    components: {}
  }
</script>