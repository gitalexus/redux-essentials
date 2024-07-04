# Проект (из туториала Redux Essential Social feed)

## Пакеты использованные в проекте

1. "prettier": "3.2.1" - конкретная версия пакета устанавливается для согласования версии у всех разработчиков при совместной работе
2. @faker-js/faker - библиотека для генерации моковых данных
3. @mswjs/data - реализует службу управляения данными для фейкового API на базе MSW
   - Хранение данных
   - Фильтрация данных
   - Предварительная обработка данных (например конвертация типов или изменение форматов)
   - Поддержка различных форматов данных (включая JSON, XML, CSV и другие)
   - Работа с большими объемами данных (птимизирован для работы с большими объемами данных)
   - Простота использования
4. date-fns - сравнение, сложение и вычитание. Также она подходит для форматирования даты и времени.
5. mock-socket - позволяет тестировать сетевое соединение без подключения к сети (например ошибки).
   > является примером внедрения зависимости (dependency injection) и позволяет избежать необходимости тестирования реальной базы данных
   > или другого внешнего кода. Вместо этого, тестируются взаимодействия с фиктивной реализацией, что упрощает и ускоряет процесс
   > тестирования.
6. msw - (Mock Service Worker) - это фреймворк для создания моков API
7. pnpm -D @types/react-router-dom - для типизации react-router=dom
8. ...

### Работа с фейковыми данными

В проекте реализована возможность тестирования как генерациии фейковой bd, так и запросов к ней череез RESTapi и аналог axios.
Причем все это работает на локальной машине, что очень удобно для тестирования приложений.

## Общая теория

### Базовый поток данных в Redux

**Redux state обновяется при помощи "reducer functions":**

- Reducers всегда вычисляют новое состояние немутабельно, копирую текущие значения state и модифицируя копии ноыми данными
- The Redux Toolkit функция createSlice генерирует "slice reducer" функции для нас, позволяя писать мутабельый код который с помощью immer далее превращается в безопасный немутабельный код автоматически.
- slice reducer функция добавляет поле редьюсера в configureStore, и задает имена данные и имя полей состояния внутри Redux store

**React components read data from the store with the useSelector hook**

- Функция Selector получает полный объект state и должна возвратить конкретное требуемое значение
- Selectors будет перезапускаться каждый раз когда Redux изменится и если данные изменились компонент будет перерисован

**React компонент осуществляет вызов dispatch actions для обновления store используя useDispatch hook или в случае TS useAppDispatch hook**

- createSlice генерирует функцию action creator для каждого reducer добавляемого в slice
- Вызываем dispatch(someActionCreator()) в компоненте, для того чтобы осуществить dispatch необходимого action
- Запускается Reducers и проверяет релевантность action и в случае релевантности возвращает новый state на основании типа action и полезной нагрузки.

> :warning: It's important to note that the component will re-render any time the value returned from useSelector changes to a new reference. Components should always try to select the smallest possible amount of data they need from the store, which will help ensure that it only renders when it actually needs to.

> :warning: Стоит обратить внимание что:
>
> - при обращении к store внутри slice мы делаем это напрямую, не добавляя название слайса к store.<property>
> - Вне слайса же обращения уже должны будут содержать store.<sliceName>.<property>

> :warning: **Redux actions and state should only contain plain JS values like objects, arrays, and primitives**. Don't put class instances, functions, or other non-serializable values into Redux!.

> :warning: it's always better to keep the action objects as small as possible, and do the state update calculations in the reducer. This also means that reducers can contain as much logic as necessary to calculate the new state.

## Использование данных в Redux

**Каждый React комопнент может использовать данные из Redux Store в любое время когда они ему необходимы**

- Любой компонент может прочитать любые данные из redux store
- Множество компонентов могут читать одни и те же данные, даже в одно и тоже время
- Компоненты должны извлекать менимально необходимое количество данных для своей отрисовки (чтобы минимизировать количество ререндеров при измнении данных которые не влияют непосредственно на компонент)
- Компоненты могут комбинировать данные из props, state и redux-store чтобы создавать необходимый им UI
- Любой компонент может dispatch action чтобы вызвать измнение redux-store

**Redux action creator может подготовить action с правильным содержимым**

- createSlice and createAction can accept a "prepare callback" that returns the action payload
- Unique IDs and other random values should be put in the action, not calculated in the reducer

**Reducers должен содержать логику обновления состояния store**

- Reducer может содержать любую логику,необходимую для вычисления следующего состояния (redux-store)
- Action должен содержать минимальное количество информации, чтобы описать, что произошло с объектом

> :warning: Redux Toolkit includes the RTK Query data fetching and caching API. RTK Query is a purpose built data fetching and caching solution for Redux apps, and can eliminate the need to write any thunks or reducers to manage data fetching. We specifically teach RTK Query as the default approach for data fetching, and RTK Query is built on the same patterns shown in this page..

## Асинхронная логика и data fetching

> :warning: В Redux не может работать с асинхронной логикой внутри себя, все действия производимые редьюсером должны быть синхронными для предсказуемости. Поэтому все асинхронные действия должны производится вне самого Redux (**Redux middleware**)

Для чего обычно используютс Redux middleware:

- выполенение дополнительной логики при запуске action (например логирование)
- установка на паузу, модификация, удаление или изменение dispatched action
- написание дополнительного кода, который имеет доступ к dispatch и getState
- учит как получить доступ к другим реальным объектам, а не только плоскому объекту action, таким как functon, promises, class instances, для их перехвата и последующей обработки.

**Существует много способов написания async middleware for redux, но redux thunk наиболее распространенный и рекомендован, он же предустановлен в RTK**

Типичный паттерн записи Thunk функции в виде creator аналогичный подходу с creator применяемыми для селектов:\

```js
// creator - пишется в виде функции принимающей толко параметры и возвращающей Thunk function
const logAndAdd = (amount) => {
  // thunk function всегда получате dispatch и getState после чего они доступны для использования внутри неё
  return (dispatch, getState) => {
    // функция обычно реализует асинхронные дейтсувия дожидается окончания и вызывает синхронный action с поомощью dispatch
    const stateBefore = getState();
    console.log(`Counter before: ${stateBefore.counter}`);
    dispatch(incrementByAmount(amount));
    const stateAfter = getState();
    console.log(`Counter after: ${stateAfter.counter}`);
  };
};

store.dispatch(logAndAdd(5));
```

<!-- TODO: созадать схему для data fething  -->

thunk функции обычно описываются в slice файлах в виде отдельных create function, таким образом они имеют доступ к стандартным плоским actions описанным в этом же slice

Data fetching логика в Redux обычно следует предсказуемому паттерну:

1. **"start"** action диспатчится перед запросом, чтобы указать, что запрос находится в прогрессе выполнения (избежать дублирования запросов, отрисовать loader)
2. делается сам асинхронный запрос к данным
3. в зависимости от результатов запроса диспатчится или **"success"** action содержащая полученные запросом данные, либо **"fail"** action с деталями ошибки. Логика либо обрабатывает полученные данные в случае успеха либо сохраняет результаты ошибки (например для последующего отображения)

-

## Выводы по архитектуре и использованным в проекте технологиям

- для тестирования приложения используется mock сервер эмулирующий работу REST server
  /api
  client.js: a small AJAX request client that allows us to make GET and POST requests (упощенный вариант axios для улучшения fetch)
  server.js: provides a fake REST API for our data. Our app will fetch data from these fake endpoints later.

  All the new features we'll add after this will follow the same basic patterns you've seen here: adding slices of state, writing reducer functions, dispatching actions, and rendering the UI based on data from the Redux store.

  We can check the Redux DevTools Extension to see the action we dispatched, and look at how the Redux state was updated in response to that action.

  the Redux store should only contain data that's considered "global" for the application!

  > :warning: Добавлено использование переиспользуемых селектов с параметрами созданных с помощью createSelect из библиотеки reselect

## Порядок реализации

1. Для начала отобразим на экране список всех постов
   1.1 - Создание postsSlice (createSlice)
   1.2 Добавляем редьюсер в store (configureStore)
   1.3 Это инициирует раздел store.posts (можно убедится в Redux DevTools)
   1.4 Считываем данные из Redux используя useSelector и выводим список posts (<PostsList>)
   1.5 - Добавляем форму создания нового post выше PostList (/_ don't try to mutate any data outside of createSlice! (immer)_/)
   1.6 Добавляем dispatch при нажатии кнопки `Add post` чтобы добавить данные в store.posts
2. Сделаем компонент для отображения одного поста детально
   1.1 Создаем SinglePostPage
   1.2 Добавлен коммент на будущее по использованию связанных селектов
   1.3 Добавим его в роутинг, добавим ссылки на компоненты при формировании PostList, для удобства добавим ссылку на корень в NavBar
3. Сделаем компонент для редактирования post
   3.1 Создаем postUpdate action в postsSlice
   3.2 Создаем PostEditForm компонент
   3.3 Добавляем роутинг в App.tsx - <Route exact path="/editPost/:postId" component={EditPostForm} />
4. Добавим функционал связанный со списком пользователей (usersSlice)...
   4.1 Создаем новый слайс users включающий логику работы с users
   4.2 Добавляем его в configureStore
   4.3 Дальнейшая логи предполагает, что при создании нового post мы будет выбирать автора (user) поэтому нам понадобится добавить поле userId в payload экшена postAdded
5. Добавление поля дата в store (и особенности с этим связанные)
   5.1 Важно помнить, что в Redux нельзя помещять несериализуемые данные (такие, как экземпляры классов или функции). Поэтому дату мы будем хранить в качестве TIMESTAMP => new Date().toISOString(), а подготавливать мы ее будем в prepare как и генерируемый id, т.к. action должен быть чистой функцией.
   5.2 Реализуем компонент презентор для отображения времени с момента создания поста в виде чпт
   5.3 Осуществим сортировку массива posts чтобы в начале были самые свежие сообщения. т.к. date хранится в виде timestamp то сортировку можно делать напрямую без преобразований просто сравнением текстовых значений. Предварительно не забудем скопировать массив так как sort это мутабельный метод массива.
   5.4 Добавим инициализацию дат в слайс использовав для этого sub (для вычитание минут с целью создания разницы в генерируемых датах)
6. Добавляем рекации (сравнительно сложная типизация)
   6.1 создаем компонент отрисовывающий кнопки реакций.
   6.2 добавляем action reactionAdded
   6.3 добавляем обработчик нажатия на кнопку рекации
7. Работа с асинхронными запросами AsyncThunk

   > :Примечание: по формированию случайных данных сервером: the mock server has been set up to reuse the same random seed each time the page is loaded, so that it will generate the same list of fake users and fake posts. If you want to reset that, delete the 'randomTimestampSeed' value in your browser's Local Storage and reload the page, or you can turn that off by editing src/api/server.js and setting useSeededRNG to false.

   7.1 Объяснение общей теории по async middleware и итоговая рекомендация использовать thunk

8. ...

### Про связанные селекторы и reselect

Если вы используете Redux Toolkit (RTK), то createSelector уже включен в его функционал, и вам не нужно импортировать его отдельно. Вместо этого, вы можете использовать createEntityAdapter для создания связанных селекторов и других полезных функций.

Вот пример того, как вы можете использовать createSelector внутри RTK:

import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

// Определение адаптера для сущностей
const postAdapter = createEntityAdapter();

// Экспорт адаптера для использования в других частях приложения
export const { selectAll: selectAllPosts } = postAdapter.getSelectors(state => state.posts);

// Создание слоя для reducer'а
const postSlice = createSlice({
name: 'posts',
initialState: postAdapter.getInitialState(),
reducers: {
// ... другие reducers
},
// Используйте дополнительный аргумент для создания связанных селекторов
extraReducers: {
// ... другие extraReducers
},
});

// Экспорт связанных селекторов
export const { selectById: selectPostById } = postSlice.cases.addCase(postSlice.reducer);
В этом примере selectAllPosts и selectPostById являются связанными селекторами, которые были созданы с помощью createEntityAdapter и createSlice. Вы можете использовать их в своих компонентах для получения данных из хранилища Redux.

Обратите внимание, что начиная с версии 8, Redux Toolkit рекомендует использовать createSlice вместо прямого вызова createSelector. Это делает процесс создания связанных селекторов более простым и удобным.

## Про Preparing Action Payloads

Если необходимо
