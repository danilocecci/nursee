import { FormEvent, useState } from "react"


export function App() {
  const [isWorkingToday, setIsWorkingToday] = useState<Boolean | undefined>(undefined)
  const [oddOrEvenDays, setOddOrEvenDays] = useState<String>('')
  const [fullDateOfSearch, setFullDateOfSearch] = useState<Date | undefined>(undefined)
  const [dayOfSearch, setDayOfSearch] = useState<String>()
  const [workingThatDay, setWorkingThatDay] = useState<Boolean>(true)

  const date = new Date(Date.now())
  const currentMonth = date.toLocaleDateString('pt-BR',{month: 'long'})
  const currentDay = date.getDate()

  function getOddOrEvenDays(notWorkingToday?: boolean) {
    const dayToCalculate = notWorkingToday  ? currentDay + 1 : currentDay

    if(dayToCalculate % 2 === 0){
      setOddOrEvenDays('pares')
    } else {
      setOddOrEvenDays('ímpares')
    }
  }

  function working() {
    setIsWorkingToday(true)
    getOddOrEvenDays()
  }

  function notWorking() {
    setIsWorkingToday(false)
    getOddOrEvenDays(true)
  }

  function calculateDayWork(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const {value} = event.currentTarget.querySelector('#date-input') as HTMLInputElement

    if(value.length == 0) return

    const dateOfSearch = new Date(value+'T00:00')
    setFullDateOfSearch(dateOfSearch)
    setDayOfSearch(dateOfSearch.getDate().toString())

    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    let dateDiff;

    isWorkingToday ? dateDiff = today.getTime() - dateOfSearch.getTime() : dateDiff = tomorrow.getTime() - dateOfSearch.getTime()
    Math.abs(Math.floor(dateDiff/(1000 * 60 * 60 * 24))) % 2 == 0 ? setWorkingThatDay(true) : setWorkingThatDay(false)
  }

  return (
    <div>
      <h1>Logo + Cabeçalho</h1>
      <div>
        <p>Você está trabalhando hoje?</p>
        {isWorkingToday !== undefined && 
          <p>Você trabalha nos dias <span>{oddOrEvenDays}</span> de <span>{currentMonth}</span>.</p>
        }
        <div>
          <button onClick={working}>Sim</button>
          <button onClick={notWorking}>Não</button>
        </div>
      </div>

      <div>
        <p>Folga?</p>
        <form onSubmit={calculateDayWork}>
          <input type="date" id="date-input"/>
          <button>Vai</button>
        </form>
        {
          dayOfSearch && 
            <p>No dia {dayOfSearch} de {fullDateOfSearch?.toLocaleString('pt-BR', {month: 'long'})} você {workingThatDay ? 'trabalha' : 'não trabalha'}.</p>
        }
      </div>
    </div>
  )
}
