<script>
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  props: {
    chartData: {
      type: Object,
      default: null
    }
  },
  watch: {
    chartData: function (val) {
      if (JSON.stringify(val.labels) !== '[]') {
        this.renderChart(
          val,
          { responsive: true, maintainAspectRatio: false }
        )
      }
    }
  }
}
</script>
