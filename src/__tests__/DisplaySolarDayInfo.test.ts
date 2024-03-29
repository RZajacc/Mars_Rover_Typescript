import fs from 'fs'
import path from 'path'
import { Window } from 'happy-dom'
import { beforeEach, expect, it, vi } from 'vitest'
import { displaySolDayInfo } from '../Utility/displaySolDayInfo'
import { PhotoManifest } from '../types/dataTypes'

const htmlDocPath = path.join(process.cwd(), 'public', 'content.html')
const htmlDocumentContent = fs.readFileSync(htmlDocPath).toString()

const window = new Window()
const document = window.document
vi.stubGlobal('document', document)

// Mock of the data provided
let photoArr: PhotoManifest[] = [
  {
    earth_date: '1',
    sol: 1,
    total_photos: 1,
    cameras: ['cam1']
  }
]
let selectedSolarDay = '1'

// Mock of the functions
const removeAllChildNodesMock = vi.fn()

beforeEach(() => {
  document.body.innerHTML = ''
  document.write(htmlDocumentContent)
  vi.clearAllMocks()
})

it('Should should call cleaning at first', () => {
  displaySolDayInfo(photoArr, selectedSolarDay, removeAllChildNodesMock)

  expect(removeAllChildNodesMock).toBeCalledTimes(1)
})

it('Should generate a paragraph as a child of solar day description div', () => {
  displaySolDayInfo(photoArr, selectedSolarDay, removeAllChildNodesMock)
  const solDayDescDiv = document.querySelector(
    '#sol-day-desc'
  ) as unknown as HTMLDivElement
  //   Get the first child of the elemnt and cast a type
  const firstChild = solDayDescDiv.firstChild as HTMLElement
  // Check if this child element exists
  expect(firstChild).not.toBeNull()
  // Check if its of specific type
  expect(firstChild.tagName).toBe('P')
})

it('Should should contain selected solar day as a part of displayed content', () => {
  const [photosN, camUsed] = displaySolDayInfo(
    photoArr,
    selectedSolarDay,
    removeAllChildNodesMock
  )

  const solDayDescDiv = document.querySelector(
    '#sol-day-desc'
  ) as unknown as HTMLDivElement
  //   Get the first child of the elemnt and cast a type
  const firstChild = solDayDescDiv.firstChild as HTMLElement

  expect(firstChild.innerHTML).toContain(selectedSolarDay)
  expect(firstChild.innerHTML).toContain(photosN)
})

it('Should return a number and a string array as a result', () => {
  const [photosN, camUsed] = displaySolDayInfo(
    photoArr,
    selectedSolarDay,
    removeAllChildNodesMock
  )

  // Test the first returned value
  expect(photosN).not.toBeNull()
  expect(photosN).toBeTypeOf('number')

  // Test second returned value
  expect(camUsed).not.toBeNull()
  expect(camUsed).toBeTypeOf('object')
})
