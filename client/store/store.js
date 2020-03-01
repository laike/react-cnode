// 这里要进行动态创建store
import AppState from './app-state'
import TopicStore from './topic-store'

export { AppState, TopicStore }

export const CreateStateMaps = () => ({
  appState: new AppState(),
  topicStore: new TopicStore(),
})

export default {
  AppState
}
