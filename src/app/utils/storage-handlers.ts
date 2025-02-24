/* eslint-disable @typescript-eslint/no-explicit-any */

const GET = <T = any>({
  key,
  storage = 'local',
  defaultValue = null
}: {
  key: string,
  storage?: 'local' | 'session',
  defaultValue?: T | null
}): T | string | null => {
  const storageRef = window[`${storage}Storage`]

  const item = storageRef.getItem(key)

  if (!item) return defaultValue

  try {
    const parsedItem = JSON.parse(item);
    if (typeof parsedItem === 'string') return item
    return parsedItem as T
  } catch {
    return item
  }
}

const SET = ({
  key,
  storage = 'local',
  value
}: {
  key: string,
  storage?: 'local' | 'session',
  value: any
}) => {
  const storageRef = window[`${storage}Storage`]
  const valueToStore = typeof value === 'string' ? value : JSON.stringify(value)
  storageRef.setItem(key, valueToStore)
}

const DELETE = ({
  key,
  storage = 'local'
}: {
  key: string,
  storage?: 'local' | 'session'
}) => {
  const storageRef = window[`${storage}Storage`]
  storageRef.removeItem(key)
}

const CLEAR = ({
  storage = 'local'
}: {
  storage?: 'local' | 'session'
}) => {
  const storageRef = window[`${storage}Storage`]
  storageRef.clear()
}


export const storage = {
  GET,
  SET,
  DELETE,
  CLEAR
}
