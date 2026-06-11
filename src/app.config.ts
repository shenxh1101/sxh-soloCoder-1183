export default defineAppConfig({
  pages: [
    'pages/jobs/index',
    'pages/resume/index',
    'pages/messages/index',
    'pages/interviews/index',
    'pages/profile/index',
    'pages/job-detail/index',
    'pages/resume-edit/index',
    'pages/resume-preview/index',
    'pages/chat-detail/index',
    'pages/publish-job/index',
    'pages/applications/index',
    'pages/privacy-settings/index',
    'pages/blacklist/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTitleText: '职聘通',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#2B6BFF',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      { pagePath: 'pages/jobs/index', text: '职位' },
      { pagePath: 'pages/resume/index', text: '简历' },
      { pagePath: 'pages/messages/index', text: '消息' },
      { pagePath: 'pages/interviews/index', text: '面试' },
      { pagePath: 'pages/profile/index', text: '我的' }
    ]
  }
})
