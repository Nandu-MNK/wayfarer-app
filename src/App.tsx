import { useEffect, useState, type FormEvent } from 'react'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Coffee,
  Compass,
  Ellipsis,
  Flower2,
  Globe2,
  MapPin,
  MessageCircle,
  Moon,
  Plus,
  Send,
  Settings2,
  Sparkles,
  Sun,
  TrainFront,
  Utensils,
  Wallet,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import kyotoCover from './assets/kyoto.jpg'
import './App.css'

type Stop = {
  time: string
  category: 'culture' | 'food' | 'transit' | 'coffee'
  title: string
  detail: string
  duration: string
}

const initialDays: { day: string; date: string; stops: Stop[] }[] = [
  {
    day: 'SUN',
    date: '12',
    stops: [
      { time: '9:00 AM', category: 'culture', title: 'Fushimi Inari Shrine', detail: 'Start early for the quietest walk through the torii gates.', duration: '2 hrs' },
      { time: '11:45 AM', category: 'food', title: 'Lunch at Vermillion', detail: 'A little coffee stop with a view, right by the shrine.', duration: '1 hr' },
      { time: '2:00 PM', category: 'culture', title: 'Wander Gion', detail: 'Take the pretty way along Shirakawa Lane and its canals.', duration: '2 hrs' },
      { time: '5:30 PM', category: 'food', title: 'Dinner at Gion Tanto', detail: 'Book ahead for the best okonomiyaki in the neighborhood.', duration: '1.5 hrs' },
    ],
  },
  {
    day: 'MON',
    date: '13',
    stops: [
      { time: '8:30 AM', category: 'culture', title: 'Arashiyama Bamboo Grove', detail: 'Go before the crowds arrive, then follow the river north.', duration: '2 hrs' },
      { time: '11:00 AM', category: 'coffee', title: 'Coffee at % Arabica', detail: 'A riverside espresso with mountain views.', duration: '45 min' },
      { time: '1:00 PM', category: 'food', title: 'Lunch in Arashiyama', detail: 'Seasonal tofu dishes at a little local spot.', duration: '1 hr' },
      { time: '3:00 PM', category: 'culture', title: 'Tenryu-ji Temple', detail: 'A stroll through the temple gardens and pond.', duration: '1.5 hrs' },
    ],
  },
  {
    day: 'TUE',
    date: '14',
    stops: [
      { time: '9:30 AM', category: 'culture', title: 'Nishiki Market', detail: 'Taste your way along Kyoto’s lively kitchen street.', duration: '2 hrs' },
      { time: '12:00 PM', category: 'food', title: 'Lunch at Omen', detail: 'Handmade udon with all the seasonal toppings.', duration: '1 hr' },
      { time: '2:00 PM', category: 'culture', title: 'Kiyomizu-dera', detail: 'Take in the city from the temple’s famous wooden terrace.', duration: '2 hrs' },
      { time: '5:00 PM', category: 'coffee', title: 'A slow one in Higashiyama', detail: 'Find a quiet tea house before your last evening.', duration: '1 hr' },
    ],
  },
]

const categoryDetails = {
  culture: { label: 'SIGHTSEEING', icon: Compass, className: 'category-culture' },
  food: { label: 'FOOD & DRINK', icon: Utensils, className: 'category-food' },
  transit: { label: 'GETTING AROUND', icon: TrainFront, className: 'category-transit' },
  coffee: { label: 'COFFEE BREAK', icon: Coffee, className: 'category-coffee' },
}

const suggestions = [
  'A quiet lunch near Gion',
  'What should I pack?',
  'Best way to get around?',
]

function App() {
  const [activeDay, setActiveDay] = useState(0)
  const [days, setDays] = useState(initialDays)
  const [tripTitle, setTripTitle] = useState('A little Kyoto spring')
  const [saveState, setSaveState] = useState<'saved' | 'saving'>('saved')
  const [darkMode, setDarkMode] = useState(false)
  const [activeNav, setActiveNav] = useState('My trips')
  const [copilotInput, setCopilotInput] = useState('')
  const [copilotAnswer, setCopilotAnswer] = useState('')
  const [budgetOpen, setBudgetOpen] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    return () => document.documentElement.classList.remove('dark')
  }, [darkMode])

  useEffect(() => {
    if (saveState === 'saved') return
    const timer = window.setTimeout(() => setSaveState('saved'), 650)
    return () => window.clearTimeout(timer)
  }, [tripTitle, saveState])

  const handleTitleChange = (value: string) => {
    setTripTitle(value)
    setSaveState('saving')
  }

  const addStop = () => {
    setDays((currentDays) =>
      currentDays.map((day, index) =>
        index === activeDay
          ? {
              ...day,
              stops: [
                ...day.stops,
                {
                  time: '6:30 PM',
                  category: 'coffee',
                  title: 'A little time to wander',
                  detail: 'Leave this one open for a lovely local discovery.',
                  duration: '1 hr',
                },
              ],
            }
          : day,
      ),
    )
  }

  const askCopilot = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const question = copilotInput.trim()
    if (!question) return
    const lowerQuestion = question.toLowerCase()
    let response = 'That sounds lovely. I’d leave a little room in the day to explore at your own pace, too.'
    if (lowerQuestion.includes('lunch') || lowerQuestion.includes('eat') || lowerQuestion.includes('food')) {
      response = 'For a relaxed lunch near Gion, try Gion Tanto for okonomiyaki or Omen for handmade udon. Both are easy to pair with a stroll along Shirakawa Lane.'
    } else if (lowerQuestion.includes('pack') || lowerQuestion.includes('wear')) {
      response = 'Spring in Kyoto can be mild but changeable. Pack comfortable walking shoes, a light layer for evenings, and a compact umbrella just in case.'
    } else if (lowerQuestion.includes('get around') || lowerQuestion.includes('train') || lowerQuestion.includes('transport')) {
      response = 'The subway and buses cover most of the city, while an IC card makes getting around simple. For Fushimi Inari, take the JR Nara Line to Inari Station.'
    } else if (lowerQuestion.includes('quiet') || lowerQuestion.includes('hidden')) {
      response = 'Try the Philosopher’s Path early in the morning, or explore the little lanes around Shirakawa in Gion. They’re especially lovely before the day-trippers arrive.'
    }
    setCopilotAnswer(response)
    setCopilotInput('')
  }

  const currentDay = days[activeDay]

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" aria-label="Wayfarer home">
          <span className="brand-mark"><Compass size={21} strokeWidth={1.8} /></span>
          <span>wayfarer<span className="brand-period">.</span></span>
        </a>

        <div className="workspace-label">WORKSPACE</div>
        <nav className="primary-nav" aria-label="Main navigation">
          <button className={`nav-link ${activeNav === 'My trips' ? 'is-active' : ''}`} onClick={() => setActiveNav('My trips')}>
            <MapPin size={17} /> <span>My trips</span><span className="nav-count">4</span>
          </button>
          <button className={`nav-link ${activeNav === 'Explore' ? 'is-active' : ''}`} onClick={() => setActiveNav('Explore')}>
            <Globe2 size={17} /> <span>Explore</span>
          </button>
          <button className={`nav-link ${activeNav === 'Saved places' ? 'is-active' : ''}`} onClick={() => setActiveNav('Saved places')}>
            <Bookmark size={17} /> <span>Saved places</span>
          </button>
        </nav>

        <div className="sidebar-section-heading">
          <span>YOUR TRIPS</span>
          <button className="icon-button subtle-icon" aria-label="Add trip"><Plus size={16} /></button>
        </div>
        <div className="trip-list">
          <button className="trip-link trip-current" onClick={() => setActiveNav('My trips')}>
            <span className="trip-dot dot-kyoto" /><span>Kyoto, Japan</span><span className="trip-current-arrow">↗</span>
          </button>
          <button className="trip-link" onClick={() => setActiveNav('My trips')}>
            <span className="trip-dot dot-lisbon" /><span>Lisbon, Portugal</span>
          </button>
          <button className="trip-link" onClick={() => setActiveNav('My trips')}>
            <span className="trip-dot dot-mexico" /><span>Mexico City</span>
          </button>
        </div>

        <div className="sidebar-bottom">
          <button className="nav-link" onClick={() => setActiveNav('Help & feedback')}><CircleHelp size={17} /><span>Help & feedback</span></button>
          <button className="nav-link" onClick={() => setActiveNav('Settings')}><Settings2 size={17} /><span>Settings</span></button>
          <div className="profile-card">
            <div className="avatar">S</div>
            <div className="profile-copy"><strong>Sophie Chen</strong><span>Free plan</span></div>
            <button className="icon-button subtle-icon" aria-label="Profile options"><Ellipsis size={18} /></button>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumbs"><span>My trips</span><ChevronRight size={14} /><strong>Kyoto, Japan</strong></div>
          <div className="topbar-actions">
            <span className={`save-status ${saveState}`}><span className="save-dot">{saveState === 'saved' ? <Check size={10} /> : null}</span>{saveState === 'saved' ? 'All changes saved' : 'Saving...'}</span>
            <span className="topbar-divider" />
            <button className="theme-toggle" onClick={() => setDarkMode((current) => !current)} aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}>
              {darkMode ? <Moon size={15} /> : <Sun size={15} />}
              <span>{darkMode ? 'Dark' : 'Light'}</span>
            </button>
            <button className="share-button"><ArrowUpRight size={15} /> Share trip</button>
          </div>
        </header>

        <div className="page-content">
          <section className="trip-heading">
            <div className="eyebrow"><span className="eyebrow-line" /> YOUR UPCOMING ADVENTURE</div>
            <div className="title-row">
              <input
                className="trip-title-input"
                aria-label="Trip title"
                value={tripTitle}
                onChange={(event) => handleTitleChange(event.target.value)}
                onFocus={(event) => event.currentTarget.select()}
              />
              <button className="icon-button title-menu" aria-label="Trip options"><Ellipsis size={21} /></button>
            </div>
            <div className="trip-meta">
              <span><MapPin size={15} /> Kyoto, Japan</span>
              <i />
              <span><CalendarDays size={15} /> May 12 – 15</span>
              <i />
              <span className="trip-style"><Flower2 size={14} /> Slow & soulful</span>
            </div>
          </section>

          <section className="hero-card" aria-label="Kyoto trip overview">
            <div
              className="hero-photo"
              style={{ backgroundImage: `linear-gradient(0deg, rgba(28,38,31,.36), transparent 49%), url("${kyotoCover}")` }}
            >
              <div className="hero-photo-caption"><span className="photo-caption-dot" /> HIGASHIYAMA, KYOTO</div>
              <div className="weather-pill"><span>☀</span> 21° <i /> MILD & SUNNY</div>
              <button className="photo-expand" aria-label="View destination photo"><ArrowUpRight size={17} /></button>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><span className="stat-label">WHEN</span><strong>May 12 – 15</strong><span className="stat-note">4 days, 3 nights</span></div>
              <div className="hero-stat"><span className="stat-label">WHO</span><strong>Just you</strong><span className="stat-note">A little solo adventure</span></div>
              <div className="hero-stat"><span className="stat-label">YOUR PACE</span><strong>Slow & soulful</strong><span className="stat-note">Room to wander</span></div>
            </div>
          </section>

          <div className="dashboard-grid">
            <section className="itinerary-panel">
              <div className="section-heading itinerary-heading">
                <div>
                  <div className="section-kicker">MAKE IT YOURS</div>
                  <h2>The little details<span className="heading-period">.</span></h2>
                </div>
                <button className="text-button"><span>View map</span><ArrowUpRight size={15} /></button>
              </div>

              <div className="day-tabs" role="tablist" aria-label="Trip days">
                {days.map((day, index) => (
                  <button
                    className={`day-tab ${activeDay === index ? 'day-tab-active' : ''}`}
                    key={day.date}
                    role="tab"
                    aria-selected={activeDay === index}
                    onClick={() => setActiveDay(index)}
                  >
                    <span>{day.day}</span><strong>{day.date}</strong>
                  </button>
                ))}
                <button className="day-tab add-day-tab" aria-label="Add another day"><Plus size={17} /></button>
              </div>

              <div className="day-summary">
                <div><h3>{activeDay === 0 ? 'A first taste of Kyoto' : activeDay === 1 ? 'A little further afield' : 'One last wander'}</h3><span>{currentDay.stops.length} little moments planned</span></div>
                <button className="icon-button subtle-icon" aria-label="Day options"><Ellipsis size={19} /></button>
              </div>

              <div className="timeline">
                {currentDay.stops.map((stop, index) => {
                  const category = categoryDetails[stop.category]
                  const CategoryIcon = category.icon
                  return (
                    <article className="timeline-item" key={`${stop.title}-${index}`}>
                      <div className="timeline-time">{stop.time}</div>
                      <div className="timeline-track"><span className={`timeline-icon ${category.className}`}><CategoryIcon size={16} /></span>{index < currentDay.stops.length - 1 && <span className="timeline-line" />}</div>
                      <div className="stop-content">
                        <div className="stop-category">{category.label}<span>·</span>{stop.duration}</div>
                        <h4>{stop.title}</h4>
                        <p>{stop.detail}</p>
                      </div>
                      <button className="stop-more icon-button subtle-icon" aria-label={`Options for ${stop.title}`}><Ellipsis size={17} /></button>
                    </article>
                  )
                })}
              </div>

              <Button variant="outline" className="add-stop-button" onClick={addStop}><Plus size={16} /> Add a stop</Button>
            </section>

            <aside className="right-column">
              <section className={`budget-card ${budgetOpen ? '' : 'budget-collapsed'}`}>
                <div className="budget-top">
                  <div className="budget-title-wrap"><span className="budget-icon"><Wallet size={17} /></span><div><div className="section-kicker">THE PRACTICAL BIT</div><h2>Trip budget</h2></div></div>
                  <button className="icon-button subtle-icon" aria-label={budgetOpen ? 'Collapse budget' : 'Expand budget'} onClick={() => setBudgetOpen((open) => !open)}><ChevronDown size={18} /></button>
                </div>
                {budgetOpen && <>
                  <div className="budget-total-row"><strong>$4,280</strong><span>of $5,000</span><span className="budget-total-caption">planned</span></div>
                  <div className="budget-progress"><span /></div>
                  <div className="budget-progress-label"><span>86% of your budget</span><span>$720 left</span></div>
                  <div className="budget-categories">
                    <div className="budget-category"><span className="budget-category-icon stay-icon"><span /></span><div className="budget-category-copy"><span>Stay</span><strong>$2,100</strong></div><div className="budget-category-meter"><span className="stay-meter" /></div></div>
                    <div className="budget-category"><span className="budget-category-icon transit-icon"><TrainFront size={15} /></span><div className="budget-category-copy"><span>Getting around</span><strong>$680</strong></div><div className="budget-category-meter"><span className="transit-meter" /></div></div>
                    <div className="budget-category"><span className="budget-category-icon food-icon"><Utensils size={15} /></span><div className="budget-category-copy"><span>Food & experiences</span><strong>$1,500</strong></div><div className="budget-category-meter"><span className="food-meter" /></div></div>
                  </div>
                  <button className="budget-edit-button">Edit budget <ArrowRight size={14} /></button>
                </>}
              </section>

              <section className="copilot-card">
                <div className="copilot-heading">
                  <div className="copilot-sparkle"><Sparkles size={17} /></div>
                  <div><span className="section-kicker">A LOCAL IN YOUR POCKET</span><h2>Your copilot<span className="heading-period">.</span></h2></div>
                  <span className="online-indicator" title="Online" />
                </div>
                <p className="copilot-intro">A little local know-how goes a long way. What’s on your mind?</p>
                <div className="suggestion-list">
                  {suggestions.map((suggestion, index) => (
                    <button className="suggestion-chip" key={suggestion} onClick={() => { setCopilotInput(suggestion); setCopilotAnswer('') }}>
                      {index === 0 ? <Utensils size={14} /> : index === 1 ? <ArrowDownRight size={14} /> : <TrainFront size={14} />}
                      {suggestion}<ChevronRight size={14} />
                    </button>
                  ))}
                </div>
                {copilotAnswer && <div className="copilot-answer"><span className="answer-avatar"><Sparkles size={13} /></span><p>{copilotAnswer}</p></div>}
                <form className="copilot-form" onSubmit={askCopilot}>
                  <input aria-label="Ask your copilot" placeholder="Ask me anything..." value={copilotInput} onChange={(event) => setCopilotInput(event.target.value)} />
                  <button type="submit" aria-label="Send question" disabled={!copilotInput.trim()}><Send size={15} /></button>
                </form>
                <div className="copilot-footnote"><MessageCircle size={12} /> Made for the curious, by the curious</div>
              </section>

              <div className="little-note"><span className="note-icon">✳</span><p><strong>A little reminder</strong><br />The best moments rarely make the itinerary.</p><ChevronRight size={16} /></div>
            </aside>
          </div>
          <footer className="page-footer"><span>Made for the long way around.</span><span><Clock3 size={12} /> Last updated just now</span></footer>
        </div>
      </main>
      <div className="mobile-bottom-bar">
        <button className="mobile-nav-active"><MapPin size={18} /><span>Trip</span></button>
        <button onClick={() => setActiveNav('Explore')}><Globe2 size={18} /><span>Explore</span></button>
        <button onClick={() => setActiveNav('Saved places')}><Bookmark size={18} /><span>Saved</span></button>
        <button onClick={() => setDarkMode((current) => !current)}>{darkMode ? <Moon size={18} /> : <Sun size={18} />}<span>Theme</span></button>
      </div>
      <button className="date-nav-prev" aria-label="Previous trip"><ChevronLeft size={17} /></button>
      <button className="date-nav-next" aria-label="Next trip"><ChevronRight size={17} /></button>
    </div>
  )
}

export default App
