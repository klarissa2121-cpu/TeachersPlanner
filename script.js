const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const iso = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const parseDate = s => new Date(`${s}T12:00:00`);
const fmt = (s, options = {day:'numeric',month:'long'}) => new Intl.DateTimeFormat('ru-RU', options).format(typeof s === 'string' ? parseDate(s) : s);
const STORE = 'klassny-plan-v1';
const SESSION_KEY = 'klassny-plan-session';
const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
if (!session) location.replace('login.html');
const DAYS = ['Понедельник','Вторник','Среда','Четверг','Пятница'];
const DAILY_QUOTES=[
  {ru:'Учитель живёт до тех пор, пока он учится.',ruBy:'Константин Ушинский',en:'A teacher affects eternity; he can never tell where his influence stops.',enBy:'Henry Adams'},
  {ru:'Воспитывает всё: люди, вещи, явления, но прежде всего и дольше всего — люди.',ruBy:'Антон Макаренко',en:'The art of teaching is the art of assisting discovery.',enBy:'Mark Van Doren'},
  {ru:'Дети должны жить в мире красоты, игры, сказки, музыки, рисунка, фантазии, творчества.',ruBy:'Василий Сухомлинский',en:'Education is not preparation for life; education is life itself.',enBy:'John Dewey'},
  {ru:'Чтение — вот лучшее учение.',ruBy:'Александр Пушкин',en:'Language is the dress of thought.',enBy:'Samuel Johnson'},
  {ru:'Как можно больше требования к человеку и как можно больше уважения к нему.',ruBy:'Антон Макаренко',en:'Teaching is the highest form of understanding.',enBy:'Aristotle'},
  {ru:'В человеке всё должно быть прекрасно: и лицо, и одежда, и душа, и мысли.',ruBy:'Антон Чехов',en:'The limits of my language mean the limits of my world.',enBy:'Ludwig Wittgenstein'},
  {ru:'Знание только тогда знание, когда оно приобретено усилиями своей мысли.',ruBy:'Лев Толстой',en:'One language sets you in a corridor for life. Two languages open every door along the way.',enBy:'Frank Smith'},
  {ru:'Педагогика должна стать наукой для всех — и для учителей, и для родителей.',ruBy:'Василий Сухомлинский',en:'Learning is a treasure that will follow its owner everywhere.',enBy:'Chinese proverb'},
  {ru:'Математику уже затем учить следует, что она ум в порядок приводит.',ruBy:'Михаил Ломоносов',en:'The beautiful thing about learning is that no one can take it away from you.',enBy:'B. B. King'},
  {ru:'Воспитание — великое дело: им решается участь человека.',ruBy:'Виссарион Белинский',en:'Tell me and I forget. Teach me and I remember. Involve me and I learn.',enBy:'Often attributed to Benjamin Franklin'}
];
DAILY_QUOTES.push(
  {ru:'Каждый урок — возможность открыть ребёнку новую дорогу.',ruBy:'Педагогическая мудрость',en:'Every lesson is a chance to open a new path for a child.',enBy:'Educational wisdom'},
  {ru:'Любознательность превращает обычный день в открытие.',ruBy:'Педагогическая мудрость',en:'Curiosity turns an ordinary day into a discovery.',enBy:'Educational wisdom'},
  {ru:'Доброе слово учителя остаётся с учеником надолго.',ruBy:'Педагогическая мудрость',en:'A teacher’s kind word stays with a student for a long time.',enBy:'Educational wisdom'},
  {ru:'Маленький шаг сегодня становится большим успехом завтра.',ruBy:'Педагогическая мудрость',en:'A small step today becomes a great success tomorrow.',enBy:'Educational wisdom'},
  {ru:'Учить — значит помогать человеку поверить в свои силы.',ruBy:'Педагогическая мудрость',en:'To teach is to help someone believe in their own strength.',enBy:'Educational wisdom'},
  {ru:'Вопрос ученика — начало настоящего исследования.',ruBy:'Педагогическая мудрость',en:'A student’s question is the beginning of real exploration.',enBy:'Educational wisdom'},
  {ru:'Терпение создаёт пространство, в котором растёт знание.',ruBy:'Педагогическая мудрость',en:'Patience creates the space in which knowledge grows.',enBy:'Educational wisdom'},
  {ru:'Успех начинается там, где ребёнка не боятся поддержать.',ruBy:'Педагогическая мудрость',en:'Success begins where a child is not afraid to seek support.',enBy:'Educational wisdom'},
  {ru:'Хороший урок оставляет желание узнать больше.',ruBy:'Педагогическая мудрость',en:'A good lesson leaves a desire to learn more.',enBy:'Educational wisdom'},
  {ru:'Внимание к каждому ученику меняет весь класс.',ruBy:'Педагогическая мудрость',en:'Attention to every student transforms the whole classroom.',enBy:'Educational wisdom'},
  {ru:'Знание становится ценным, когда им хочется делиться.',ruBy:'Педагогическая мудрость',en:'Knowledge becomes valuable when we want to share it.',enBy:'Educational wisdom'},
  {ru:'Ошибка — не конец пути, а подсказка для следующего шага.',ruBy:'Педагогическая мудрость',en:'A mistake is not the end of the road, but a clue for the next step.',enBy:'Educational wisdom'},
  {ru:'Спокойствие учителя помогает классу услышать главное.',ruBy:'Педагогическая мудрость',en:'A teacher’s calm helps the class hear what matters most.',enBy:'Educational wisdom'},
  {ru:'Уважение открывает двери, которые не открыть требованием.',ruBy:'Педагогическая мудрость',en:'Respect opens doors that demands cannot.',enBy:'Educational wisdom'},
  {ru:'Творчество начинается с разрешения мыслить иначе.',ruBy:'Педагогическая мудрость',en:'Creativity begins with permission to think differently.',enBy:'Educational wisdom'},
  {ru:'Каждый ребёнок учится быстрее, когда чувствует себя значимым.',ruBy:'Педагогическая мудрость',en:'Every child learns faster when they feel valued.',enBy:'Educational wisdom'},
  {ru:'План помогает видеть цель, но вдохновение помогает к ней идти.',ruBy:'Педагогическая мудрость',en:'A plan reveals the goal, while inspiration helps us reach it.',enBy:'Educational wisdom'},
  {ru:'Настоящее понимание начинается с внимательного слушания.',ruBy:'Педагогическая мудрость',en:'True understanding begins with careful listening.',enBy:'Educational wisdom'},
  {ru:'Урок становится живым, когда в нём есть место удивлению.',ruBy:'Педагогическая мудрость',en:'A lesson comes alive when there is room for wonder.',enBy:'Educational wisdom'},
  {ru:'Поддержка сегодня рождает самостоятельность завтра.',ruBy:'Педагогическая мудрость',en:'Support today builds independence tomorrow.',enBy:'Educational wisdom'},
  {ru:'Учитель освещает путь, но шаги ученик делает сам.',ruBy:'Педагогическая мудрость',en:'A teacher lights the path, but the student takes the steps.',enBy:'Educational wisdom'},
  {ru:'Новый день приносит новую возможность научиться.',ruBy:'Педагогическая мудрость',en:'A new day brings a new opportunity to learn.',enBy:'Educational wisdom'},
  {ru:'Сильный класс начинается с доверия.',ruBy:'Педагогическая мудрость',en:'A strong classroom begins with trust.',enBy:'Educational wisdom'},
  {ru:'Объяснить просто — значит понять глубоко.',ruBy:'Педагогическая мудрость',en:'To explain simply is to understand deeply.',enBy:'Educational wisdom'},
  {ru:'Интерес — лучший первый шаг к знанию.',ruBy:'Педагогическая мудрость',en:'Interest is the best first step toward knowledge.',enBy:'Educational wisdom'},
  {ru:'Вдохновение растёт там, где замечают старание.',ruBy:'Педагогическая мудрость',en:'Inspiration grows where effort is noticed.',enBy:'Educational wisdom'},
  {ru:'Не сравнивайте детей — помогайте каждому расти.',ruBy:'Педагогическая мудрость',en:'Do not compare children; help each one grow.',enBy:'Educational wisdom'},
  {ru:'Задача учителя — не дать готовый путь, а научить выбирать.',ruBy:'Педагогическая мудрость',en:'A teacher’s task is not to give a ready path, but to teach how to choose.',enBy:'Educational wisdom'},
  {ru:'Даже тихий ученик заслуживает быть услышанным.',ruBy:'Педагогическая мудрость',en:'Even the quietest student deserves to be heard.',enBy:'Educational wisdom'},
  {ru:'Радость открытия делает знание прочным.',ruBy:'Педагогическая мудрость',en:'The joy of discovery makes knowledge lasting.',enBy:'Educational wisdom'},
  {ru:'Похвала за усилие учит не бояться сложностей.',ruBy:'Педагогическая мудрость',en:'Praising effort teaches students not to fear difficulty.',enBy:'Educational wisdom'},
  {ru:'Учебный день ценен не количеством дел, а смыслом.',ruBy:'Педагогическая мудрость',en:'A school day is measured not by tasks, but by meaning.',enBy:'Educational wisdom'},
  {ru:'Ясная цель делает сложную работу понятнее.',ruBy:'Педагогическая мудрость',en:'A clear goal makes difficult work easier to understand.',enBy:'Educational wisdom'},
  {ru:'Забота о себе помогает учителю заботиться об учениках.',ruBy:'Педагогическая мудрость',en:'Self-care helps a teacher care for students.',enBy:'Educational wisdom'},
  {ru:'Самые важные уроки часто начинаются с простого разговора.',ruBy:'Педагогическая мудрость',en:'The most important lessons often begin with a simple conversation.',enBy:'Educational wisdom'},
  {ru:'Уверенность ребёнка растёт из маленьких побед.',ruBy:'Педагогическая мудрость',en:'A child’s confidence grows from small victories.',enBy:'Educational wisdom'},
  {ru:'Когда знания связаны с жизнью, они обретают смысл.',ruBy:'Педагогическая мудрость',en:'Knowledge gains meaning when it is connected to life.',enBy:'Educational wisdom'},
  {ru:'Учитель тоже учится — вместе со своим классом.',ruBy:'Педагогическая мудрость',en:'A teacher learns too, together with the class.',enBy:'Educational wisdom'},
  {ru:'Добрая атмосфера помогает смелее задавать вопросы.',ruBy:'Педагогическая мудрость',en:'A kind atmosphere encourages braver questions.',enBy:'Educational wisdom'},
  {ru:'Каждый завершённый день — часть большого пути.',ruBy:'Педагогическая мудрость',en:'Every completed day is part of a greater journey.',enBy:'Educational wisdom'}
);
const INDEPENDENT_ENGLISH_QUOTES=[
  ['Wonder is the beginning of wisdom.','Socrates'],
  ['The roots of education are bitter, but the fruit is sweet.','Aristotle'],
  ['Learning never exhausts the mind.','Leonardo da Vinci'],
  ['The mind is not a vessel to be filled, but a fire to be kindled.','Plutarch'],
  ['Education is the kindling of a flame, not the filling of a vessel.','Educational wisdom'],
  ['What we learn with pleasure we never forget.','Alfred Mercier'],
  ['The expert in anything was once a beginner.','Helen Hayes'],
  ['A good teacher can inspire hope and ignite the imagination.','Brad Henry'],
  ['Curiosity is the wick in the candle of learning.','William Arthur Ward'],
  ['Success is the sum of small efforts repeated day after day.','Robert Collier'],
  ['The future depends on what you do today.','Mahatma Gandhi'],
  ['It always seems impossible until it is done.','Nelson Mandela'],
  ['The secret of getting ahead is getting started.','Mark Twain'],
  ['Great things are done by a series of small things brought together.','Vincent van Gogh'],
  ['Nothing will work unless you do.','Maya Angelou'],
  ['Believe you can and you are halfway there.','Theodore Roosevelt'],
  ['Quality is not an act; it is a habit.','Educational wisdom'],
  ['Well begun is half done.','Aristotle'],
  ['The beginning is the most important part of the work.','Plato'],
  ['A little progress each day adds up to big results.','Educational wisdom'],
  ['Do what you can, with what you have, where you are.','Theodore Roosevelt'],
  ['There is no substitute for hard work.','Thomas Edison'],
  ['Ideas are the beginning points of all fortunes.','Napoleon Hill'],
  ['Action is the foundational key to all success.','Pablo Picasso'],
  ['The beautiful thing about learning is that nobody can take it away from you.','B. B. King'],
  ['Preparation is the key to success.','Alexander Graham Bell'],
  ['A goal without a plan is just a wish.','Antoine de Saint-Exupéry'],
  ['You do not find the happy life; you make it.','Camilla Eyring Kimball'],
  ['Kindness is a language everyone understands.','Educational wisdom'],
  ['No act of kindness, no matter how small, is ever wasted.','Aesop'],
  ['Wherever there is a human being, there is an opportunity for kindness.','Seneca'],
  ['Patience is bitter, but its fruit is sweet.','Educational wisdom'],
  ['The best way out is always through.','Robert Frost'],
  ['Turn your wounds into wisdom.','Oprah Winfrey'],
  ['Happiness depends upon ourselves.','Aristotle'],
  ['The only source of knowledge is experience.','Albert Einstein'],
  ['Life is trying things to see if they work.','Ray Bradbury'],
  ['Every moment is a fresh beginning.','T. S. Eliot'],
  ['Make each day your masterpiece.','John Wooden'],
  ['Start where you are. Use what you have. Do what you can.','Arthur Ashe']
];
INDEPENDENT_ENGLISH_QUOTES.forEach(([en,enBy],index)=>Object.assign(DAILY_QUOTES[index+10],{en,enBy}));
const seed = {
  tasks: [
    {id:1,text:'Проверить тетради 7Б',date:'2026-09-03',priority:'high',done:false},
    {id:2,text:'Подготовить материалы к уроку',date:'2026-09-03',priority:'medium',done:false},
    {id:3,text:'Заполнить электронный журнал',date:'2026-09-04',priority:'low',done:false}
  ],
  events: [
    {id:1,text:'День знаний',date:'2026-09-01',type:'school'},
    {id:2,text:'Родительское собрание',date:'2026-09-10',type:'important'},
    {id:3,text:'Осенние каникулы',date:'2026-10-26',type:'holiday'},
    {id:4,text:'Педагогический совет',date:'2026-11-05',type:'important'},
    {id:5,text:'Зимние каникулы',date:'2026-12-28',type:'holiday'},
    {id:6,text:'Весенние каникулы',date:'2027-03-22',type:'holiday'},
    {id:7,text:'Последний звонок',date:'2027-05-25',type:'school'}
  ],
  schedule: {
    'Понедельник': [['08:30','Математика','7А','205'],['09:25','Математика','6Б','205'],['10:30','Алгебра','8А','205'],['11:25','Геометрия','8Б','205']],
    'Вторник': [['08:30','Алгебра','9А','205'],['09:25','Математика','5Б','205'],['10:30','Геометрия','7А','205'],['12:20','Классный час','7А','205']],
    'Среда': [['09:25','Математика','6А','205'],['10:30','Алгебра','8А','205'],['11:25','Математика','5Б','205']],
    'Четверг': [['08:30','Геометрия','8Б','205'],['09:25','Математика','7А','205'],['11:25','Алгебра','9А','205'],['12:20','Математика','6Б','205']],
    'Пятница': [['08:30','Математика','5Б','205'],['09:25','Алгебра','8А','205'],['10:30','Математика','6А','205']]
  },
  classSchedule: {
    'Понедельник': [['08:30','Русский язык','7А','307'],['09:25','Математика','7А','205'],['10:30','История','7А','312'],['11:25','Биология','7А','118']],
    'Вторник': [['08:30','Литература','7А','307'],['09:25','Английский язык','7А','214'],['10:30','Геометрия','7А','205'],['11:25','Физкультура','7А','Спортзал']],
    'Среда': [['08:30','География','7А','310'],['09:25','Русский язык','7А','307'],['10:30','Физика','7А','216'],['11:25','Информатика','7А','203']],
    'Четверг': [['08:30','История','7А','312'],['09:25','Математика','7А','205'],['10:30','Литература','7А','307'],['11:25','Музыка','7А','109']],
    'Пятница': [['08:30','Биология','7А','118'],['09:25','Английский язык','7А','214'],['10:30','Русский язык','7А','307'],['11:25','Технология','7А','102']]
  }, note:''
};
let state;
try { state = {...seed,...JSON.parse(localStorage.getItem(STORE) || '{}')}; } catch { state = structuredClone(seed); }
const CALENDAR_START=new Date(2026,8,1),CALENDAR_END=new Date(2027,5,1);
let shownMonth = new Date(CALENDAR_START), taskFilter = 'all', scheduleDay = 'Понедельник', todayScheduleDay = null;
const DEFAULT_BELL_TIMES={1:['08:00','08:40'],2:['08:50','09:30'],3:['09:45','10:25'],4:['10:45','11:25'],5:['11:45','12:25'],6:['12:40','13:20'],7:['13:30','14:10'],8:['14:20','15:00']};
state.bellTimes ||= JSON.parse(JSON.stringify(DEFAULT_BELL_TIMES));
const BELL_TIMES=state.bellTimes;
function mondayOf(date){const d=new Date(date);d.setHours(12,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));return d;}
function weekValue(date){const d=new Date(date);d.setHours(12,0,0,0);d.setDate(d.getDate()+3-((d.getDay()+6)%7));const first=new Date(d.getFullYear(),0,4,12);const week=1+Math.round(((d-first)/86400000-3+((first.getDay()+6)%7))/7);return `${d.getFullYear()}-W${String(week).padStart(2,'0')}`;}
function mondayFromWeek(value){const [year,week]=value.split('-W').map(Number),jan4=new Date(year,0,4,12);const monday=mondayOf(jan4);monday.setDate(monday.getDate()+(week-1)*7);return monday;}
let selectedWeek=iso(mondayOf(schoolToday()));
const ACADEMIC_START=new Date(2026,8,1,12),ACADEMIC_END=new Date(2027,5,30,12);
function academicWeeks(){const weeks=[];let start=new Date(ACADEMIC_START),number=1;while(start<=ACADEMIC_END){const end=new Date(start);end.setDate(end.getDate()+(number===1?5:6));if(end>ACADEMIC_END)end.setTime(ACADEMIC_END.getTime());weeks.push({number,key:iso(mondayOf(start)),start:new Date(start),end});start=new Date(end);start.setDate(start.getDate()+1);number++;}return weeks;}
const SCHOOL_WEEKS=academicWeeks();
function clone(value){return JSON.parse(JSON.stringify(value));}
function ensureWeek(key){
  state.weekSchedules ||= {};
  if(!state.weekSchedules[key]){
    const earlier=Object.keys(state.weekSchedules).filter(k=>k<key).sort().at(-1);
    const source=earlier?state.weekSchedules[earlier]:{mine:state.schedule,class7a:state.classSchedule,extras:Object.fromEntries(DAYS.map(day=>[day,[]]))};
    state.weekSchedules[key]=clone(source);save();
  }
  state.weekSchedules[key].extras ||= Object.fromEntries(DAYS.map(day=>[day,[]]));
  return state.weekSchedules[key];
}
function activeSchedules(){return ensureWeek(selectedWeek);}
const save = () => localStorage.setItem(STORE, JSON.stringify(state));
function applyBellTimesToClassTable(table){
  DAYS.forEach(day=>{table[day] ||= [];const current=table[day];for(let number=1;number<=8;number++){let lesson=current.find(item=>Number(item[5])===number)||current[number-1];if(!lesson){lesson=['','', '7А','', '',number,''];current.push(lesson);}lesson[5]=number;lesson[0]=BELL_TIMES[number][0];lesson[4]=BELL_TIMES[number][1];lesson[2]||='7А';}current.sort((a,b)=>Number(a[5])-Number(b[5]));});
}
function applyBellTimesToClassSchedules(){applyBellTimesToClassTable(state.classSchedule);Object.values(state.weekSchedules||{}).forEach(week=>{week.class7a ||= Object.fromEntries(DAYS.map(day=>[day,[]]));applyBellTimesToClassTable(week.class7a);});}
const CLASS_BELLS_VERSION='planner-class-bells-v1';if(!localStorage.getItem(CLASS_BELLS_VERSION)){applyBellTimesToClassSchedules();save();localStorage.setItem(CLASS_BELLS_VERSION,'done');}
const EMPTY_SCHEDULE_VERSION='klassny-plan-empty-subjects-v1';
if(!localStorage.getItem(EMPTY_SCHEDULE_VERSION)){
  const clearLessons=table=>Object.values(table||{}).forEach(day=>day.forEach(lesson=>{lesson[1]='';lesson[3]='';}));
  clearLessons(state.schedule);clearLessons(state.classSchedule);
  Object.values(state.weekSchedules||{}).forEach(week=>{clearLessons(week.mine);clearLessons(week.class7a);});
  save();localStorage.setItem(EMPTY_SCHEDULE_VERSION,'done');
}
const SIMPLE_EVENT_TYPES_VERSION='klassny-plan-simple-event-types-v1';
if(!localStorage.getItem(SIMPLE_EVENT_TYPES_VERSION)){state.events.forEach(event=>{if(event.type!=='important')event.type='event';});save();localStorage.setItem(SIMPLE_EVENT_TYPES_VERSION,'done');}
const PDF_CALENDAR_VERSION='klassny-plan-calendar-2026-2027-v1';
const PDF_CALENDAR_DATA=`
2026-09-01|День знаний
2026-09-02|День окончания Второй мировой войны (1945)
2026-09-02|100 лет со дня рождения Е. П. Леонова (1926–1994)
2026-09-03|День солидарности в борьбе с терроризмом
2026-09-08|Международный день распространения грамотности
2026-09-08|День Бородинского сражения (1812)
2026-09-08|День языков народов России
2026-09-11|День победы русской эскадры у мыса Тендра (1790)
2026-09-11|День специалиста органов воспитательной работы
2026-09-12|Всемирный день оказания первой медицинской помощи
2026-09-13|Международный день памяти жертв фашизма
2026-09-13|День танкиста
2026-09-20|День работников леса
2026-09-21|День победы в Куликовской битве (1380)
2026-09-21|День зарождения российской государственности
2026-09-25|120 лет со дня рождения Д. Д. Шостаковича (1906–1975)
2026-09-27|День работника дошкольного образования
2026-09-27|Всемирный день туризма
2026-09-28|День работника атомной промышленности
2026-09-30|День воссоединения ДНР, ЛНР, Запорожской и Херсонской областей с Россией
2026-10-01|Международный день пожилых людей
2026-10-01|Международный день музыки
2026-10-01|День Сухопутных войск
2026-10-02|Международный день социального педагога
2026-10-02|День среднего профессионального образования
2026-10-04|День начала космической эры человечества
2026-10-04|День Космических войск
2026-10-04|Всемирный день защиты животных
2026-10-05|День учителя
2026-10-05|Всемирный день архитектуры
2026-10-05|Международный день врача
2026-10-09|День разгрома немецко-фашистских войск в битве за Кавказ (1943)
2026-10-09|Всероссийский день чтения
2026-10-10|Всемирный день психического здоровья
2026-10-14|День работников заповедного дела
2026-10-18|День отца
2026-10-26|Международный день школьных библиотек
2026-10-30|130 лет со дня рождения А. Г. Новикова (1896–1984)
2026-11-04|День народного единства
2026-11-07|День военного парада на Красной площади (1941)
2026-11-08|День Сибири
2026-11-09|Международный день против фашизма, расизма и антисемитизма
2026-11-10|День сотрудников органов внутренних дел РФ
2026-11-10|Всемирный день молодёжи
2026-11-11|Международный день энергосбережения
2026-11-12|Синичкин день
2026-11-13|Международный день слепых
2026-11-19|День ракетных войск и артиллерии
2026-11-19|315 лет со дня рождения М. В. Ломоносова (1711–1765)
2026-11-20|День начала Нюрнбергского процесса
2026-11-20|Всемирный день ребёнка
2026-11-22|День сыновей в России
2026-11-22|День словарей и энциклопедий
2026-11-22|День психолога
2026-11-28|120 лет со дня рождения Д. С. Лихачёва (1906–1999)
2026-11-29|День матери в России
2026-11-30|День Государственного герба Российской Федерации
2026-11-30|Всемирный день домашних животных
2026-11-30|Международный день защиты информации
2026-12-01|День победы русской эскадры у мыса Синоп (1853)
2026-12-01|День математика
2026-12-01|130 лет со дня рождения Г. К. Жукова (1896–1974)
2026-12-03|День Неизвестного Солдата
2026-12-03|День юриста
2026-12-03|Международный день людей с ограниченными возможностями здоровья
2026-12-05|День начала контрнаступления в битве под Москвой (1941)
2026-12-05|Международный день добровольца
2026-12-09|День Героев Отечества
2026-12-10|Международный день прав человека
2026-12-12|День Конституции Российской Федерации
2026-12-12|260 лет со дня рождения Н. М. Карамзина (1766–1826)
2026-12-17|День Ракетных войск стратегического назначения
2026-12-20|День работника органов безопасности РФ
2026-12-22|День энергетика
2026-12-24|День взятия крепости Измаил (1790)
2026-12-25|День государственных символов России
2026-12-27|День спасателя
2026-12-28|Международный день кино
2027-01-01|Новый год
2027-01-02|Новогодние праздники
2027-01-02|200 лет со дня рождения П. П. Семёнова-Тян-Шанского (1827–1914)
2027-01-06|155 лет со дня рождения А. Н. Скрябина (1872–1915)
2027-01-07|Рождество Христово
2027-01-11|День заповедников и национальных парков России
2027-01-13|День российской печати
2027-01-25|День российского студенчества
2027-01-25|195 лет со дня рождения И. И. Шишкина (1832–1898)
2027-01-26|Всемирный день таможенника
2027-01-27|Международный день памяти жертв Холокоста
2027-01-27|День полного освобождения Ленинграда от блокады (1944)
2027-01-28|Международный день защиты персональных данных
2027-01-28|130 лет со дня рождения В. П. Катаева (1897–1986)
2027-01-31|Международный день без Интернета
2027-02-01|День разгрома немецко-фашистских войск в Сталинградской битве (1943)
2027-02-03|Всемирный день борьбы с ненормативной лексикой
2027-02-07|День зимних видов спорта в России
2027-02-07|Всемирный день балета
2027-02-08|День российской науки
2027-02-09|День гражданской авиации
2027-02-10|День дипломатического работника
2027-02-14|Международный день книгодарения
2027-02-15|День памяти воинов-интернационалистов
2027-02-21|Международный день родного языка
2027-02-23|День защитника Отечества
2027-02-26|105 лет со дня рождения Ю. М. Лотмана (1922–1993)
2027-02-28|День Арктики
2027-03-02|День наставника
2027-03-03|Всемирный день писателя
2027-03-04|Всемирный день инженерии
2027-03-08|Международный женский день
2027-03-13|День искусственного интеллекта
2027-03-14|Международный день рек
2027-03-15|Всемирный день защиты прав потребителей
2027-03-18|День воссоединения Крыма с Россией
2027-03-18|День выхода человека в открытый космос (1965)
2027-03-21|Всемирный день поэзии
2027-03-21|Международный день лесов
2027-03-22|Международная акция «Час Земли»
2027-03-25|День работника культуры
2027-03-27|Всемирный день театра
2027-03-31|145 лет со дня рождения К. И. Чуковского (1882–1969)
2027-04-06|Международный день спорта на благо развития и мира
2027-04-07|Всемирный день здоровья
2027-04-08|День российской анимации
2027-04-10|90 лет со дня рождения Б. А. Ахмадулиной (1937–2010)
2027-04-12|День космонавтики
2027-04-18|День победы князя А. Невского на Чудском озере (1242)
2027-04-19|День памяти о геноциде советского народа
2027-04-22|Всемирный день Земли
2027-04-25|День дочерей в России
2027-04-26|День участников ликвидации последствий радиационных аварий и катастроф
2027-04-27|День российского парламентаризма
2027-04-27|День работника скорой медицинской помощи
2027-04-28|125 лет со дня рождения В. А. Осеевой (1902–1969)
2027-04-30|День пожарной охраны
2027-05-01|Праздник Весны и Труда
2027-05-07|День радио
2027-05-09|День Победы в Великой Отечественной войне
2027-05-12|День завершения Крымской наступательной операции
2027-05-13|День Черноморского флота ВМФ России
2027-05-13|День российского телевидения
2027-05-17|День рождения Интернета
2027-05-18|Международный день музеев
2027-05-19|День детских общественных организаций России
2027-05-24|День славянской письменности и культуры
2027-05-26|День российского предпринимательства
2027-05-27|Общероссийский день библиотек
2027-05-28|День пограничника
2027-05-30|135 лет со дня рождения И. С. Соколова-Микитова (1892–1975)
2027-05-30|115 лет со дня рождения Л. И. Ошанина (1912–1996)
2027-05-31|135 лет со дня рождения К. Г. Паустовского (1892–1968)`;
if(!localStorage.getItem(PDF_CALENDAR_VERSION)){
  PDF_CALENDAR_DATA.trim().split('\n').forEach((line,index)=>{const [date,text]=line.split('|');if(!state.events.some(event=>event.date===date&&event.text===text))state.events.push({id:2600000000000+index,date,text,type:'important',note:''});});
  save();localStorage.setItem(PDF_CALENDAR_VERSION,'done');
}
const EXISTING_EVENTS_CALENDAR_VERSION='planner-existing-events-calendar-v1';
if(!localStorage.getItem(EXISTING_EVENTS_CALENDAR_VERSION)){
  state.events.forEach(event=>{event.type='calendar';});
  save();localStorage.setItem(EXISTING_EVENTS_CALENDAR_VERSION,'done');
}

function schoolToday(){ const now=new Date(); return now>=new Date(2026,8,1)&&now<=new Date(2027,5,30)?now:new Date(2026,8,3); }
function setView(name){
  document.body.dataset.activeView=name;
  $$('.view').forEach(v=>v.classList.toggle('active',v.id===`${name}View`));
  $$('.nav-item').forEach(v=>v.classList.toggle('active',v.dataset.view===name));
  const titles={today:'Добрый день!',calendar:'Календарь',schedule:'Расписание',tasks:'Задачи'};
  $('#pageTitle').textContent=titles[name]; document.body.classList.remove('menu-open');
  $('#topAddTask').hidden=name==='today'||name==='calendar'||name==='schedule';
  $('#todayWeekDays').hidden=name!=='today';
  $('.topbar-quote').hidden=name!=='today';
  $('.topbar-holiday').hidden=name!=='today';
  $('#monthPickerWrap').hidden=name!=='calendar';
  if(name==='calendar') renderCalendar(); if(name==='tasks') renderTasks();
  history.replaceState(null,'',`#${name}`);
}
function renderHeader(){
  if (session) {
    $('#userName').textContent = 'Юлия';
    $('#userEmail').textContent = session.email;
    $('#userAvatar').textContent = 'Ю';
  }
  const d=schoolToday(); $('#dateLine').textContent=fmt(d,{weekday:'long',day:'numeric',month:'long'});
  const start=new Date(2026,8,1), end=new Date(2027,5,30); const p=Math.max(0,Math.min(100,Math.round((d-start)/(end-start)*100)));
  $('#progressValue').textContent=`${p}%`; $('#progressBar').style.width=`${p}%`;
}
function renderToday(){
  const d=schoolToday(), key=iso(d), actualDay=DAYS[d.getDay()-1], day=todayScheduleDay||actualDay, todayWeek=ensureWeek(iso(mondayOf(d))), lessons=(todayWeek.mine[day]||[]), classLessons=(todayWeek.class7a[day]||[]), extrasLessons=(todayWeek.extras[day]||[]);
  const monday=mondayOf(d);$('#todayWeekDays').innerHTML=DAYS.map((name,index)=>{const date=new Date(monday);date.setDate(date.getDate()+index);return `<button class="today-day ${name===day?'active':''}" data-today-day="${name}" title="${fmt(date)}"><span>${['Пн','Вт','Ср','Чт','Пт'][index]}</span><b>${date.getDate()}</b></button>`;}).join('');
  $('#todayLessons').innerHTML=todayScheduleHTML(lessons,true,'На сегодня уроков нет');
  $('#todayClassLessons').innerHTML=todayScheduleHTML(classLessons,false,'На сегодня уроков нет');
  $('#todayExtrasLessons').innerHTML=todayScheduleHTML(extrasLessons,true,'На сегодня занятий нет');
  const open=state.tasks.filter(t=>!t.done);
  $('#quickTasks').innerHTML=open.slice(0,4).map(taskHTML).join('')||'<p class="empty">Все дела выполнены — прекрасно!</p>';
  $('#navTaskCount').textContent=open.length;
  const futureHolidays=state.events.filter(e=>e.type==='holiday'&&parseDate(e.date)>=d).sort((a,b)=>a.date.localeCompare(b.date));
  $('#holidayDays').textContent=futureHolidays.length?Math.ceil((parseDate(futureHolidays[0].date)-d)/86400000):'—';
  const weekEnd=new Date(d);weekEnd.setDate(weekEnd.getDate()+6);
  const upcoming=state.events.filter(e=>parseDate(e.date)>=d&&parseDate(e.date)<=weekEnd).sort((a,b)=>a.date.localeCompare(b.date));
  const typeNames={calendar:'Календарное',event:'Календарное',academic:'Учебное',school:'Школьное',important:'Важное',holiday:'Каникулы'};
  $('#eventsStrip').innerHTML=upcoming.map(e=>`<div class="event-card event-${e.type}"><div class="event-date"><strong>${parseDate(e.date).getDate()}</strong><span>${fmt(e.date,{month:'short'})}</span></div><i class="event-dot ${e.type==='important'?'red':e.type==='holiday'?'yellow':e.type}"></i><div><strong>${e.text}</strong><small>${fmt(e.date,{weekday:'long'})} · ${typeNames[e.type]||'Календарное'}</small></div><button class="delete-event" data-id="${e.id}" title="Удалить">×</button></div>`).join('')||'<p class="empty">На ближайшие семь дней событий нет</p>';
  const dayNumber=Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/86400000),quote=DAILY_QUOTES[((dayNumber%DAILY_QUOTES.length)+DAILY_QUOTES.length)%DAILY_QUOTES.length];
  $('#russianQuote').textContent=`«${quote.ru}»`;$('#russianAuthor').textContent=`— ${quote.ruBy}`;$('#englishQuote').textContent=`“${quote.en}”`;$('#englishAuthor').textContent=`— ${quote.enBy}`;
  updateSchoolClock();
}
function todayScheduleHTML(lessons,hasHomework,emptyText){if(!lessons.length)return `<p class="empty">${emptyText}</p>`;const headers=hasHomework?['№','Начало','Конец','Предмет','Задание','Каб.']:['№','Начало','Конец','Предмет','Каб.'];return `<div class="today-table-head ${hasHomework?'with-homework':''}">${headers.map(item=>`<span>${item}</span>`).join('')}</div>`+lessons.map((lesson,index)=>`<div class="today-table-row ${hasHomework?'with-homework':''}"><b>${lesson[5]||index+1}</b><time>${lesson[0]||'—'}</time><time>${lesson[4]||'—'}</time><strong>${escapeHTML(lesson[1]||'—')}</strong>${hasHomework?`<span class="today-homework">${escapeHTML(lesson[6]||'—')}</span>`:''}<span>${escapeHTML(lesson[3]||'—')}</span></div>`).join('');}
function clockMinutes(value){const [hours,minutes]=(value||'00:00').split(':').map(Number);return hours*60+minutes;}
function updateSchoolClock(){
  const clock=$('#currentTime'),label=$('#lessonProgressLabel'),remaining=$('#lessonProgressMinutes'),bar=$('#lessonProgressBar');
  if(!clock||!label||!remaining||!bar)return;
  const now=new Date(),current=now.getHours()*60+now.getMinutes()+now.getSeconds()/60;
  clock.textContent=now.toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'});
  const d=schoolToday(),day=DAYS[d.getDay()-1],lessons=(ensureWeek(iso(mondayOf(d))).mine[day]||[]).filter(l=>l[0]&&l[4]).slice().sort((a,b)=>clockMinutes(a[0])-clockMinutes(b[0]));
  if(!lessons.length){label.textContent='Сегодня уроков нет';remaining.textContent='';bar.style.width='0%';return;}
  const active=lessons.find(l=>current>=clockMinutes(l[0])&&current<clockMinutes(l[4]));
  if(active){const start=clockMinutes(active[0]),end=clockMinutes(active[4]),left=Math.max(1,Math.ceil(end-current));label.textContent=active[1]||'Текущий урок';remaining.textContent=`До конца урока ${left} мин.`;bar.style.width=`${Math.max(0,Math.min(100,(current-start)/(end-start)*100))}%`;return;}
  const next=lessons.find(l=>clockMinutes(l[0])>current);
  if(next){const nextStart=clockMinutes(next[0]),previous=[...lessons].reverse().find(l=>clockMinutes(l[4])<=current);const start=previous?clockMinutes(previous[4]):Math.floor(current);const left=Math.max(1,Math.ceil(nextStart-current));label.textContent=previous?'Перемена':'До начала занятий';remaining.textContent=previous?`До конца перемены ${left} мин.`:`Первый урок через ${left} мин.`;bar.style.width=previous?`${Math.max(0,Math.min(100,(current-start)/(nextStart-start)*100))}%`:'0%';return;}
  label.textContent='Уроки на сегодня закончились';remaining.textContent='';bar.style.width='100%';
}
function taskHTML(t){return `<div class="task-row ${t.done?'done':''}"><button class="check" data-task="${t.id}" aria-label="Выполнить">${t.done?'✓':''}</button><div><strong>${escapeHTML(t.text)}</strong><small>${fmt(t.date)} · <span class="priority ${t.priority}">${{high:'важно',medium:'обычно',low:'не срочно'}[t.priority]}</span></small></div><button class="delete-task" data-id="${t.id}" aria-label="Удалить задачу" title="Удалить задачу">✕</button></div>`;}
function renderTasks(){
  let list=state.tasks.slice().sort((a,b)=>(a.date||'9999-12-31').localeCompare(b.date||'9999-12-31')||a.done-b.done);
  if(taskFilter==='open')list=list.filter(t=>!t.done); if(taskFilter==='done')list=list.filter(t=>t.done);
  const groups=list.reduce((result,task)=>{const key=task.date||'without-date';(result[key]??=[]).push(task);return result;},{});
  $('#allTasks').innerHTML=Object.entries(groups).map(([date,tasks])=>`<section class="task-date-group"><h3>${date==='without-date'?'Без даты':fmt(date,{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</h3><div>${tasks.map(taskHTML).join('')}</div></section>`).join('')||'<p class="empty">Здесь пока пусто</p>'; $('#navTaskCount').textContent=state.tasks.filter(t=>!t.done).length;
}
function renderCalendar(){
  const monthName=fmt(shownMonth,{month:'long',year:'numeric'});$('#monthTitle').textContent=monthName;$('#monthPicker').value=`${shownMonth.getFullYear()}-${String(shownMonth.getMonth()+1).padStart(2,'0')}`;$('#prevMonth').disabled=shownMonth<=CALENDAR_START;$('#nextMonth').disabled=shownMonth>=CALENDAR_END; const y=shownMonth.getFullYear(),m=shownMonth.getMonth(),first=(new Date(y,m,1).getDay()+6)%7,last=new Date(y,m+1,0).getDate(),today=iso(schoolToday()); let html='';
  for(let i=0;i<first;i++)html+='<div class="calendar-day muted-day"></div>';
  for(let n=1;n<=last;n++){const key=iso(new Date(y,m,n)),events=state.events.filter(e=>e.date===key);html+=`<button class="calendar-day ${key===today?'today':''}" data-calendar-date="${key}" aria-label="Открыть события: ${fmt(key)}"><b>${n}</b>${events.map(e=>`<span class="cal-event ${e.type}" title="${escapeHTML(e.text)}">${escapeHTML(e.text)}</span>`).join('')}</button>`;}
  $('#calendarGrid').innerHTML=html;
}
function lessonEnd(start){const [h,m]=start.split(':').map(Number),d=new Date(2000,0,1,h,m+45);return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;}
function scheduleTable(kind, lessons){
  const fields=[['5','number','№','number'],['0','start','Начало','time'],['4','end','Конец','time'],['1','subject','Предмет','text'],['3','room','Кабинет','text']];
  const hasHomework=kind!=='class7a';
  const fieldInput=(f,n,i,values)=>`<label><span>${f[2]}</span><input type="${f[3]}" value="${escapeHTML(String(values[n]))}" data-schedule-kind="${kind}" data-index="${i}" data-field="${f[0]}" ${f[0]==='5'?'min="1" max="12"':''}></label>`;
  const headings=hasHomework?[...fields.slice(0,4).map(f=>f[2]),'Задание',fields[4][2]]:fields.map(f=>f[2]);
  return `<div class="schedule-table-head ${hasHomework?'with-homework':''}">${headings.map(title=>`<span>${title}</span>`).join('')}<span></span></div>`+lessons.map((l,i)=>{
    const number=l[5]??i+1; if(l[5]===undefined)l[5]=number;if(!l[0])l[0]=BELL_TIMES[number]?.[0]||'08:30';if(!l[4])l[4]=BELL_TIMES[number]?.[1]||lessonEnd(l[0]);
    const values=[number,l[0],l[4],l[1]||'',l[3]||''];
    const inputs=hasHomework?fields.slice(0,4).map((f,n)=>fieldInput(f,n,i,values)).join('')+`<button class="homework-button ${l[6]?'filled':''}" data-homework-kind="${kind}" data-index="${i}" title="Открыть домашнее задание">${l[6]?'Задано':'＋ Задание'}</button>`+fieldInput(fields[4],4,i,values):fields.map((f,n)=>fieldInput(f,n,i,values)).join('');
    return `<div class="editable-lesson ${hasHomework?'with-homework':''}">${inputs}<button class="remove-lesson" data-remove-schedule="${kind}" data-index="${i}" aria-label="Удалить урок">×</button></div>`;
  }).join('') || '<p class="empty schedule-empty">На этот день уроков нет</p>';
}
function renderSchedule(){
  const week=activeSchedules(),start=parseDate(selectedWeek),end=new Date(start);end.setDate(end.getDate()+6);
  const academic=SCHOOL_WEEKS.find(item=>item.key===selectedWeek)||SCHOOL_WEEKS[0];
  $('#weekPicker').innerHTML=SCHOOL_WEEKS.map(item=>`<option value="${item.key}" ${item.key===selectedWeek?'selected':''}>Неделя ${item.number} · ${fmt(item.start,{day:'numeric',month:'short'})} — ${fmt(item.end,{day:'numeric',month:'short'})}</option>`).join('');
  $('#weekRange').textContent=`Учебная неделя №${academic.number}`;
  $('#scheduleDays').innerHTML=DAYS.map(day=>`<button class="day-tab ${day===scheduleDay?'active':''}" data-schedule-day="${day}">${day.slice(0,2)}<span>${day}</span></button>`).join('');
  week.mine[scheduleDay] ||= [];week.class7a[scheduleDay] ||= [];week.extras[scheduleDay] ||= [];
  $('#myScheduleTable').innerHTML=scheduleTable('mine',week.mine[scheduleDay]);
  $('#classScheduleTable').innerHTML=scheduleTable('class7a',week.class7a[scheduleDay]);
  $('#extrasScheduleTable').innerHTML=scheduleTable('extras',week.extras[scheduleDay]);
}
function scheduleList(kind){const week=activeSchedules();return kind==='mine'?week.mine[scheduleDay]:kind==='class7a'?week.class7a[scheduleDay]:week.extras[scheduleDay];}
function escapeHTML(s){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
let openedCalendarDate='';
function renderDayDialog(){
  $('#dayDialogTitle').textContent=fmt(openedCalendarDate,{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  const events=state.events.filter(event=>event.date===openedCalendarDate).sort((a,b)=>a.id-b.id);
  $('#dayEventsList').innerHTML=events.map(event=>`<div class="day-event-row"><label>Событие<input value="${escapeHTML(event.text)}" data-day-event="${event.id}" data-event-field="text" placeholder="Название события"></label><label class="event-note-field">Заметка<button class="event-note-button ${event.note?'filled':''}" data-event-note="${event.id}" type="button">${event.note?'Заметка добавлена':'＋ Добавить'}</button></label><label>Дата<input type="date" value="${event.date}" data-day-event="${event.id}" data-event-field="date"></label><label>Категория<select data-day-event="${event.id}" data-event-field="type"><option value="calendar" ${event.type==='calendar'||event.type==='event'?'selected':''}>Календарное</option><option value="academic" ${event.type==='academic'?'selected':''}>Учебное</option><option value="school" ${event.type==='school'?'selected':''}>Школьное</option><option value="important" ${event.type==='important'?'selected':''}>Важное</option></select></label><button class="remove-day-event" data-remove-day-event="${event.id}" aria-label="Удалить событие">×</button></div>`).join('')||'<p class="empty">На этот день событий пока нет</p>';
}
function openDayDialog(date){openedCalendarDate=date;renderDayDialog();$('#dayDialog').showModal();}
function renderBellSchedule(){$('.bell-times').innerHTML=Object.entries(BELL_TIMES).map(([number,times])=>`<label class="bell-time"><b>${number}</b><input type="time" value="${times[0]}" data-bell-number="${number}" data-bell-part="0" aria-label="Начало ${number} урока"><i>–</i><input type="time" value="${times[1]}" data-bell-number="${number}" data-bell-part="1" aria-label="Конец ${number} урока"></label>`).join('');}
function refresh(){renderHeader();renderToday();renderTasks();renderSchedule();renderCalendar();}

document.addEventListener('click',e=>{
  const nav=e.target.closest('[data-view]'); if(nav)setView(nav.dataset.view);
  const todayDay=e.target.closest('[data-today-day]');if(todayDay){todayScheduleDay=todayDay.dataset.todayDay;renderToday();}
  const go=e.target.closest('[data-go]'); if(go)setView(go.dataset.go);
  const open=e.target.closest('[data-open]'); if(open){const type=open.dataset.open,dialog=$(`#${type}Dialog`),date=iso(schoolToday());$(`#${type}Date`).value=date;if(type==='task')setTaskDatePicker(date);dialog.showModal();}
  const check=e.target.closest('[data-task]'); if(check){const t=state.tasks.find(t=>t.id===Number(check.dataset.task));t.done=!t.done;save();refresh();}
  const del=e.target.closest('.delete-task'); if(del){state.tasks=state.tasks.filter(t=>t.id!==Number(del.dataset.id));save();refresh();}
  const de=e.target.closest('.delete-event'); if(de){state.events=state.events.filter(x=>x.id!==Number(de.dataset.id));save();refresh();}
  const calendarDay=e.target.closest('[data-calendar-date]');if(calendarDay)openDayDialog(calendarDay.dataset.calendarDate);
  const removeDayEvent=e.target.closest('[data-remove-day-event]');if(removeDayEvent){state.events=state.events.filter(event=>event.id!==Number(removeDayEvent.dataset.removeDayEvent));save();renderDayDialog();renderCalendar();renderToday();}
  const eventNote=e.target.closest('[data-event-note]');if(eventNote){const event=state.events.find(item=>item.id===Number(eventNote.dataset.eventNote));if(event){$('#eventNoteForm').dataset.eventId=event.id;$('#eventNoteTitle').textContent=event.text||'Событие без названия';$('#eventNoteText').value=event.note||'';$('#eventNoteDialog').showModal();}}
  const dayButton=e.target.closest('[data-schedule-day]'); if(dayButton){scheduleDay=dayButton.dataset.scheduleDay;renderSchedule();}
  const add=e.target.closest('[data-add-schedule]'); if(add){const kind=add.dataset.addSchedule,list=scheduleList(kind),number=Math.min(8,list.length+1),times=BELL_TIMES[number]||['08:00','08:40'];list.push([times[0],'',kind==='class7a'?'7А':'','',times[1],number,'']);save();renderSchedule();renderToday();}
  const remove=e.target.closest('[data-remove-schedule]'); if(remove){scheduleList(remove.dataset.removeSchedule).splice(Number(remove.dataset.index),1);save();renderSchedule();renderToday();}
  const homework=e.target.closest('[data-homework-kind]');if(homework){const kind=homework.dataset.homeworkKind,index=Number(homework.dataset.index),lesson=scheduleList(kind)[index];$('#homeworkForm').dataset.kind=kind;$('#homeworkForm').dataset.index=index;$('#homeworkText').value=lesson[6]||'';$('#homeworkLesson').textContent=`${scheduleDay} · ${lesson[1]||'занятие без названия'} · ${lesson[0]}–${lesson[4]}`;$('#homeworkDialog').showModal();}
});
document.addEventListener('change',e=>{const input=e.target.closest('[data-schedule-kind]');if(!input)return;const lesson=scheduleList(input.dataset.scheduleKind)[Number(input.dataset.index)],field=Number(input.dataset.field),value=input.type==='number'?Number(input.value):input.value;lesson[field]=value;if(field===5&&BELL_TIMES[value]){lesson[0]=BELL_TIMES[value][0];lesson[4]=BELL_TIMES[value][1];renderSchedule();}save();renderToday();});
document.addEventListener('change',e=>{const input=e.target.closest('[data-bell-number]');if(!input)return;const number=Number(input.dataset.bellNumber),part=Number(input.dataset.bellPart);BELL_TIMES[number][part]=input.value;state.bellTimes=BELL_TIMES;applyBellTimesToClassSchedules();save();renderSchedule();renderToday();renderBellSchedule();});
document.addEventListener('input',e=>{const input=e.target.closest('[data-day-event]');if(!input||input.dataset.eventField!=='text')return;const event=state.events.find(item=>item.id===Number(input.dataset.dayEvent));if(event){event.text=input.value;save();renderCalendar();renderToday();}});
document.addEventListener('change',e=>{const input=e.target.closest('[data-day-event]');if(!input)return;const event=state.events.find(item=>item.id===Number(input.dataset.dayEvent));if(!event)return;event[input.dataset.eventField]=input.value;save();if(input.dataset.eventField==='date')renderDayDialog();renderCalendar();renderToday();});
$('#taskForm').addEventListener('submit',e=>{if(e.submitter?.value==='cancel')return;e.preventDefault();state.tasks.push({id:Date.now(),text:$('#taskText').value.trim(),date:$('#taskDate').value,priority:$('#taskPriority').value,done:false});save();e.target.reset();$('#taskDialog').close();refresh();});
$('#eventForm').addEventListener('submit',e=>{if(e.submitter?.value==='cancel')return;e.preventDefault();state.events.push({id:Date.now(),text:$('#eventText').value.trim(),date:$('#eventDate').value,type:$('#eventType').value});save();e.target.reset();$('#eventDialog').close();refresh();});
$('#homeworkForm').addEventListener('submit',e=>{if(e.submitter?.value==='cancel')return;e.preventDefault();const form=e.currentTarget,lesson=scheduleList(form.dataset.kind)[Number(form.dataset.index)];lesson[6]=$('#homeworkText').value;save();$('#homeworkDialog').close();renderSchedule();});
$('#clearHomework').onclick=()=>{$('#homeworkText').value='';};
$('#eventNoteForm').addEventListener('submit',e=>{if(e.submitter?.value==='cancel')return;e.preventDefault();const event=state.events.find(item=>item.id===Number(e.currentTarget.dataset.eventId));if(event){event.note=$('#eventNoteText').value;save();}$('#eventNoteDialog').close();renderDayDialog();});
$('#clearEventNote').onclick=()=>{$('#eventNoteText').value='';};
$('#closeDayDialog').onclick=()=>$('#dayDialog').close();
$('#addDayEvent').onclick=()=>{state.events.push({id:Date.now(),text:'',date:openedCalendarDate,type:'event'});save();renderDayDialog();setTimeout(()=>$('#dayEventsList input[data-event-field="text"]:last-of-type')?.focus(),0);renderCalendar();};
$('#quickNote').value=state.note||''; $('#quickNote').addEventListener('input',e=>{state.note=e.target.value;save();$('#noteStatus').textContent='Сохранено';setTimeout(()=>$('#noteStatus').textContent='Сохраняется автоматически',1200);});
$('#prevMonth').onclick=()=>{const next=new Date(shownMonth.getFullYear(),shownMonth.getMonth()-1,1);if(next>=CALENDAR_START){shownMonth=next;renderCalendar();}}; $('#nextMonth').onclick=()=>{const next=new Date(shownMonth.getFullYear(),shownMonth.getMonth()+1,1);if(next<=CALENDAR_END){shownMonth=next;renderCalendar();}};
for(let date=new Date(CALENDAR_START);date<=CALENDAR_END;date=new Date(date.getFullYear(),date.getMonth()+1,1)){const value=`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`,option=document.createElement('option');option.value=value;option.textContent=fmt(date,{month:'long',year:'numeric'});$('#monthPicker').append(option);}
$('#monthPicker').addEventListener('change',e=>{if(!e.target.value)return;const [year,month]=e.target.value.split('-').map(Number);shownMonth=new Date(year,month-1,1);renderCalendar();});
const TASK_MONTHS=['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
$('#taskMonth').innerHTML=TASK_MONTHS.map((name,index)=>`<option value="${index+1}">${name}</option>`).join('');
function updateTaskDateValue(){const year=Number($('#taskYear').value),month=Number($('#taskMonth').value),previous=Number($('#taskDay').value)||1,days=new Date(year,month,0).getDate();$('#taskDay').innerHTML=Array.from({length:days},(_,index)=>`<option value="${index+1}">${index+1}</option>`).join('');$('#taskDay').value=Math.min(previous,days);$('#taskDate').value=`${year}-${String(month).padStart(2,'0')}-${String($('#taskDay').value).padStart(2,'0')}`;}
function setTaskDatePicker(value){const [year,month,day]=value.split('-').map(Number);$('#taskYear').value=year;$('#taskMonth').value=month;updateTaskDateValue();$('#taskDay').value=day;updateTaskDateValue();}
['taskDay','taskMonth','taskYear'].forEach(id=>$(`#${id}`).addEventListener('change',updateTaskDateValue));setTaskDatePicker(iso(schoolToday()));
$$('.filter').forEach(b=>b.onclick=()=>{$$('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');taskFilter=b.dataset.filter;renderTasks();});
$('#menuButton')?.addEventListener('click',()=>document.body.classList.toggle('menu-open'));
function changeAcademicWeek(step){const current=Math.max(0,SCHOOL_WEEKS.findIndex(item=>item.key===selectedWeek)),next=Math.max(0,Math.min(SCHOOL_WEEKS.length-1,current+step));selectedWeek=SCHOOL_WEEKS[next].key;ensureWeek(selectedWeek);renderSchedule();}
$('#prevWeek').onclick=()=>changeAcademicWeek(-1);
$('#nextWeek').onclick=()=>changeAcademicWeek(1);
$('#weekPicker').onchange=e=>{if(!e.target.value)return;selectedWeek=e.target.value;ensureWeek(selectedWeek);renderSchedule();};
$('#logoutButton').onclick=()=>{localStorage.removeItem(SESSION_KEY);location.replace('login.html');};
refresh(); setView(location.hash.slice(1)||'today'); setInterval(updateSchoolClock,1000);
