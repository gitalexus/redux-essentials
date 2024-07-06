# Работа с Redux в версии RTK (разбор Redux Essentials Tutorial)

В приложении используется моковый REST сервер на базе пакета msw
Сами данные генерируются с помощью пакета @faker-js/faker
Типизировалось самостоятельно, поэтому могут быть ошибки, требуется доуточнение

## Реализовано

- Создание Slices глобального store (RootStore) c помощью createSlice, который возвращает автоматически сгенерированные actions и reducer
- Объединение слайсов в единый редьеюсер с помощью configureStore
- Модификация данных в Store с учетом интеграции Immer в пакет RTK
- Использование Селекторов и хука useSelect (useAppSelect - типизированный вариант) для доступа к данным хранилища из любого компонента в любом месте приложения
- Использование переиспользуемых селекторов с целью вынесения их логики в единое место (slice)
- Вызовы dispatch (useAppDispatch - типизированный вариант) с ранее сформированными actions
- Можно увидеть разницу при обращении к store в редьюсерах слайса и при обращении к store в селекторах (первые используют, а вторые нет имя слайса)
- Асинхронные действия с помощью Redux-Thunk функций (createAsyncThunk)
- Дополнение редьюсра extraReducers(builder) в который собираем обработки автоматически создаваемых actions на базе состояний промиса и использование этого в data-fetching и управлении состояниями компонетов
- Исопльзование в асинхронных unwrap для обработки результатов диспатча асинхронного дейтсвия в try ... catch блоках