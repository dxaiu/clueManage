import defaultSettings from '@/settings'

const title = defaultSettings.title || '起量数据管理系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
