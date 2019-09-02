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
                <datepicker :disabled-dates="this.disabledDatesTo" v-model="from"></datepicker>
              </div>
              <div class="col-md-auto">
                <label>До</label>
                <datepicker :disabled-dates="this.disabledDatesFrom" v-model="to"></datepicker>
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
            <template v-if="isLoaded">
    <div v-if="isEmpty">Пусто</div>
    <BarChart v-else  :chartData="chartData"/>
            </template>
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
      chartData: null,
      isLoaded: false,
      disabledDatesTo: {
        from: new Date()
      },
      disabledDatesFrom: {
        from: new Date(),
        to: new Date()
      }
    }
  },
  computed: {
    isEmpty: function () {
      return this.chartData === null || this.chartData.datasets[0].data.length === 0
    }
  },
  watch: {
    from: function (newValue) {
      const newDateTo = new Date(newValue)
      const newDisabledDateTo = new Date(newDateTo.setDate(newDateTo.getDate() + 6))
      this.disabledDatesFrom.to = newDisabledDateTo
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
          this.isLoaded = true
        },
        error => {
          console.error(error)
        }
      )
    }

  }
}
</script>
