import { FormEvent, useState } from "react"


export function App() {
  const [isWorkingToday, setIsWorkingToday] = useState<Boolean | undefined>(undefined)
  const [oddOrEvenDays, setOddOrEvenDays] = useState<String>('')
  const [fullDateOfSearch, setFullDateOfSearch] = useState<Date | undefined>(undefined)
  const [dayOfSearch, setDayOfSearch] = useState<String>()
  const [workingThatDay, setWorkingThatDay] = useState<Boolean>(true)
  const [daysOff, setDaysOff] = useState<Array<String>>()
  const [dateInputValue, setDateInputValue] = useState('')

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
    setDateInputValue(value)

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

  async function addDaysOff(event: FormEvent<HTMLFormElement>){
    event.preventDefault()

    const {value} = event.currentTarget.querySelector('#date-input-dayOff') as HTMLInputElement
    console.log(daysOff)
    if(daysOff?.includes(value)) {
      return
    }
    !daysOff ? setDaysOff([value]) : setDaysOff([...daysOff,value])
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-baseline gap-4 border-b-2">
        <h1 className="font-bold text-3xl ml-4">Nursee</h1>
        <p className="text-sm">Uma ferramenta para plantonistas.</p>
      </header>

      <main className="flex items-center flex-col gap-6">
        <div className="flex items-center flex-col">
          <p className="text-lg">Você está trabalhando hoje?</p>
          
          <div className="flex gap-1 items-center justify-center">
            <button onClick={working} className="px-1 focus:border-b">Sim</button>
            <button onClick={notWorking} className="px-1 focus:border-b">Não</button>
          </div>
          {isWorkingToday !== undefined && 
            <p>Você trabalha nos dias <span className="font-bold">{oddOrEvenDays}</span> de <span>{currentMonth}</span>.</p>
          }
        </div>
        
        {isWorkingToday !== undefined && 
          <>
            <div className="flex items-center flex-col">
              <p className="text-lg">Adicionar folgas:</p>
              <form onSubmit={addDaysOff} className="flex gap-3">
                <input type="date" id="date-input-dayOff" className="rounded-lg text-center bg-cyan-800 outline-none"/>
                <button className="px-1 hover:border-b">Vai</button>
              </form>
              {daysOff && (
                  <div className="flex flex-wrap gap-2 mt-2">
                      {daysOff.map(day => {
                        const spacesFromDates = /\-/gi
                        const fullDate = day.replace(spacesFromDates,'')
                        const date = new Date(day+'T00:00').toLocaleDateString("pt-BR", {day:"2-digit", month:"2-digit", year:"2-digit"})
                        return (
                          <span key={fullDate} className="text-zinc-100 bg-cyan-950 px-2 py-1 rounded-lg">{date}</span>
                        )
                      })}
                  </div>
              )}
            </div>

            <div className="flex items-center flex-col">
              <p className="text-lg">Pesquisar se trabalha ou não:</p>
              <form onSubmit={calculateDayWork} className="flex gap-3">
                <input type="date" id="date-input" className="text-green-900 rounded-lg text-center"/>
                <button className="px-1 hover:border-b">Vai</button>
              </form>
              {
                dayOfSearch && 
                  <p>No dia {dayOfSearch} de {fullDateOfSearch?.toLocaleString('pt-BR', {month: 'long'})} você <span className="font-bold">{!daysOff?.includes(dateInputValue) && workingThatDay ? 'trabalha' : 'não trabalha'}</span>.</p>
              }
            </div>
          </>
        }

      </main>

      

    </div>
  )
}
