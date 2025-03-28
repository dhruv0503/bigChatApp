import { Line, Doughnut } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    Tooltip,
    Filler,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    ArcElement,
    Legend
} from 'chart.js'
import { getLast7Days } from '../../lib/features'

ChartJS.register(
    Tooltip,
    Filler,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    ArcElement,
    Legend
)

const LineChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: false
        },
        title: {
            display: false
        }
    },
    scales: {
        x: {
            grid: {
                display: false
            }
        },
        y: {
            beginAtZero: true,
            grid: {
                display: false
            }
        }
    }
}

const DoughnutChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: false
        }
    },
    cutout : 100
}

const labels = getLast7Days();

const LineChart = ({ value }) => {
    const data = {
        labels,
        datasets: [{
            label: 'Total Messages',
            data: value,
            fill: true,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor : 'rgba(75, 192, 192, 0.2)',
            tension: 0.1
        }]
    }
    return (
        <Line data={data} options={LineChartOptions} />
    )
}
const DoughnutChart = ({value = [], labels = []}) => {
    const data = {
        labels,
        datasets: [{
            data: value,
            fill: true,
            borderColor: ['rgb(75, 192, 192)','rgb(255,99,132)' ],
            backgroundColor : ['rgba(75, 192, 192, 0.5)', 'rgba(255, 99, 132, 0.5)'],
            hoverBackgroundColor : ["rgba(75, 192, 212, 0.8)", "rgba(250, 99, 132, 0.8"],
            offset: 20,
        }]
    }
    return (
        <Doughnut style={{zIndex : 10}} data={data} options={DoughnutChartOptions}/>
    )
}

export { LineChart, DoughnutChart }