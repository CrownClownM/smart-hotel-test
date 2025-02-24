import { $, $$ } from "@utils/js-selector";

type NotificationType = 'info' | 'error' | 'warning' | 'success';

const CONTAINER_ID = 'lg-notifications-container'

const CONFIG: NotificationSettings = {
  timer: 5000,
  position: 'top-right',
  autoclose: true
}

interface NotificationSettings {
  timer: number;
  position: keyof typeof notificationPositions;
  autoclose: boolean;
}

interface Notification {
  type: NotificationType,
  title: string,
  text: string,
  timer?: number,
  position?: keyof typeof notificationPositions,
  autoclose?: boolean
}

const icons = {
  info: (className?: string) => {
    return `
      <svg  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor" stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round" class="${className}"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" /></svg>
    `
  },
  error: (className?: string) => {
    return `
      <svg width="24" height="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"  viewBox="0 0 24 24" class="${className}"><path stroke="none" d="M0 0h24v24H0z"/><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0M12 8v4M12 16h.01"/></svg>
    `
  },
  warning: (className?: string) => {
    return `
      <svg width="24" height="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" class="${className}"><path stroke="none" d="M0 0h24v24H0z"/><path d="M12 9v4M10.363 3.591 2.257 17.125a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636-2.87L13.637 3.59a1.914 1.914 0 0 0-3.274 0zM12 16h.01"/></svg>
    `
  },
  success: (className?: string) => {
    return `
      <svg width="24" height="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" class="${className}"><path stroke="none" d="M0 0h24v24H0z"/><path d="M8.56 3.69a9 9 0 0 0-2.92 1.95M3.69 8.56A9 9 0 0 0 3 12M3.69 15.44a9 9 0 0 0 1.95 2.92M8.56 20.31A9 9 0 0 0 12 21M15.44 20.31a9 9 0 0 0 2.92-1.95M20.31 15.44A9 9 0 0 0 21 12M20.31 8.56a9 9 0 0 0-1.95-2.92M15.44 3.69A9 9 0 0 0 12 3M9 12l2 2 4-4"/></svg>
    `
  },
  times: (className?: string) => {
    return `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${className}"><path d="M0 0h24v24H0z" stroke="none"/><path d="M18 6 6 18M6 6l12 12"/></svg>`
  }
}

const notificationStyles = {
  'info': ['bg-blue-200', 'text-blue-700', 'border', 'border-blue-700'],
  'error': ['bg-red-200', 'text-red-700', 'border', 'border-red-700'],
  'warning': ['bg-yellow-200', 'text-yellow-700', 'border', 'border-yellow-700'],
  'success': ['bg-green-200', 'text-green-700', 'border', 'border-green-700']
}

const notificationPositions = {
  'top-right': ['top-10', 'right-5'],
  'top-left': ['top-10', 'left-5'],
  'bottom-right': ['bottom-10', 'right-5'],
  'bottom-left': ['bottom-10', 'left-5']
}

const settings = ({
  timer,
  autoclose,
  position
}: NotificationSettings) => {
  CONFIG.timer = timer || CONFIG.timer;
  CONFIG.position = position || CONFIG.position;
  CONFIG.autoclose = autoclose || CONFIG.autoclose;
}

const createNotification = (notification_data: Notification) => {
  const element = document.createElement('div');

  const alert_role = notification_data.type === 'error' ? 'alert' : 'status';

  element.setAttribute('role', alert_role);
  element.setAttribute('data-identifier', 'notification');
  element.setAttribute('aria-live', 'assertive');
  element.setAttribute('data-position', notification_data.position!);

  element.classList.add(
    ...['absolute', 'rounded-md', 'overflow-hidden', 'p-2', 'pointer-events-auto', 'z-50'],
    ...notificationPositions[notification_data.position as keyof typeof notificationPositions],
    ...notificationStyles[notification_data.type as keyof typeof notificationStyles]
  )

  const closeBtn = !notification_data.autoclose ? document.createElement('button') : null;

  if (closeBtn) {
    closeBtn.classList.add(...['absolute', 'top-[2px]', 'right-[2px]']);
    closeBtn.setAttribute('type', 'button');
    closeBtn.innerHTML = icons.times('size-4');
  }

  element.innerHTML = `
    <div class="flex flex-row gap-x-2 relative w-80">
      ${closeBtn ? closeBtn.outerHTML : ''}
      <div class="grid place-items-center">
        ${icons[notification_data.type as keyof typeof icons]('size-10')}
      </div>
      <div class="flex flex-col">
        <p class="max-w-[20ch] text-pretty"><b>${notification_data.title}</b></p>
        <p class="max-w-[25ch] text-pretty ">${notification_data.text}</p>
      </div>
    </div>
  `

  if (!notification_data.autoclose) {
    $('button', element)?.addEventListener('click', () => {
      element.remove();
      updateNotificationsPosition();
    })
  }

  return element
}

function updateNotificationsPosition() {
  const active_notifications = $$('[data-identifier="notification"]')
  let newPosition = 10;

  active_notifications.forEach((notification) => {
    const ele = notification as HTMLElement
    const { position } = ele.dataset

    if (position!.includes('top')) {
      ele.style.top = `${newPosition}px`
      newPosition += ele.offsetHeight + 10;
    }
    if (position!.includes('bottom')) {
      ele.style.bottom = `${newPosition}px`
      newPosition += ele.offsetHeight + 10;
    }
  })
}

const pushNotification = (notification_data: Notification) => {
  const body = $(`#${CONTAINER_ID}`)

  const notification = createNotification(notification_data)

  body?.append(notification)

  updateNotificationsPosition()

  if (notification_data.autoclose) {
    setTimeout(() => {
      body?.removeChild(notification)
    }, notification_data.timer)
  }
}

const fireNotification = (data: Notification) => {
  const notification = createNotificationEvent(data)

  const notificationsContainer = $(`#${CONTAINER_ID}`)

  if (notificationsContainer) {
    notificationsContainer.dispatchEvent(notification)
  }
}

function createNotificationEvent({
  type,
  title,
  text,
  timer = CONFIG.timer,
  position = CONFIG.position,
  autoclose = CONFIG.autoclose
}: Notification) {
  const event = new CustomEvent('notification', {
    detail: {
      type,
      title,
      text,
      timer,
      position,
      autoclose
    }
  })
  return event;
}

const notificationsListener = (event: Event) => {
  const ev = event as CustomEvent<Notification>
  pushNotification(ev.detail)
}

const init = (config: NotificationSettings) => {
  const body$ = $('body')
  settings(config)
  const notificationsContainer = document.createElement('div')
  notificationsContainer.id = CONTAINER_ID
  notificationsContainer.classList.add(
    ...['w-full', 'min-h-screen', 'fixed', 'top-0', 'left-0', 'pointer-events-none', 'z-40']
  )

  notificationsContainer.addEventListener('notification', notificationsListener)

  body$?.insertAdjacentElement('afterbegin', notificationsContainer)
}

export const notification = {
  fire: fireNotification,
  init: init,
  handler: notificationsListener
}
