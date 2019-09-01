<template>
  <div class="reqapp">
    <div id="requests-example" class="container">
  <div class="row">
          <div class="col">

          <h1 class="text-center">Статистика</h1>
          <form v-on:submit.prevent="getRejectReasonsTimeline">
            <input
              v-model="from"
              id="from"
              type="hidden"
            />
            <input
              v-model="to"
              id="to"
              type="hidden"
            />
            <div class="row justify-content-md-center">
              <div class="col-md-auto">
                <label>От</label>
                <datepicker :disabled-dates="this.disabledDates" v-model="from"></datepicker>
              </div>
              <div class="col-md-auto">
                <label>До</label>
                <datepicker :disabled-dates="this.disabledDates" v-model="to"></datepicker>
              </div>

            </div>

            <button
              type="submit"
              class="btn btn-success btn-block mx-auto mt-4 col-6"
            >
              Показать
            </button>
          </form>
          </div>
          <div class="w-100"></div>
          <div class="col mt-4">
    <BarChart :chartData="chartData"/>
    </div>
    </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Datepicker from 'vuejs-datepicker/dist/vuejs-datepicker.esm.js'
import BarChart from './BarChart.vue'

export default {
  components: {
    Datepicker,
    BarChart
  },
  data () {
    return {
      from: '',
      to: '',
      chartData: {},
      disabledDates: {
        from: new Date(),
        customPredictor: function (date) {
          // console.log((date.getDate() - this.from.getDate()))
          if (!this.from) {
            return true
          }
        }
      }
    }
  },
  methods: {
    getRejectReasonsTimeline () {
      axios({ method: 'GET', url: '/api/rejectReasonsTimeline', params: {from: this.from, to: this.to} }).then(
        result => {
          let labels = result.data.map((res) => Object.keys(res)).flat()
          labels = [...new Set(labels)].filter((x) => x !== 'date')
          const count = labels.map((x) => {
            return result.data.reduce((acc, cur) => {
              if (x in cur) {
                return acc + cur[x]
              }
              return acc
            }, 0)
          })
          this.chartData = {
            labels,
            datasets: [
              {
                label: 'Статистика причин отказов',
                backgroundColor: '#f87979',
                data: count
              }
            ]
          }
        },
        error => {
          console.error(error)
        }
      )
    }

  }
}
</script>
