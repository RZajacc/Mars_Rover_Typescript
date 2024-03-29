/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { missionManifest } from '../types/dataTypes'

/**
 * If the rover name was selected by a user on the page then data will be fetched
 * from NASA API. This entry doesn't contain images, but it holds a lot of information
 * about selected rovers mission. Part of if will be displayed on the page as a result
 * @param {missionManifest} info Data fetched from NASA API for selected rover
 * @param {(parent : HTMLElement) => void} removeAllChildNodes Cleaner function
 */
export function displayRoverInfo(
  info: missionManifest,
  removeAllChildNodes: (parent: HTMLElement) => void
): string[] {
  // * Create a field to display provided message and append it
  const roverInfo: HTMLDivElement = document.querySelector('#rover-info')!
  const roverParagraph = document.createElement('p')
  roverParagraph.innerHTML = `<strong>${info.name}</strong> was active for 
      <strong>${info.max_sol}</strong> solar days, and made 
      <strong>${info.total_photos}</strong> during that time. Current mission 
      status is <strong id="mission-status">${info.status}</strong>.`
  roverInfo.appendChild(roverParagraph)

  // * Check mission status and add value to a field
  const missionStatus: HTMLElement = document.querySelector('#mission-status')!

  missionStatus.textContent = info.status.toUpperCase()

  // * Apply color to mission status depending if its active or not
  if (info.status === 'active') {
    missionStatus.setAttribute('style', 'color:#7CFC00')
  } else {
    missionStatus.setAttribute('style', 'color:red')
  }

  // * Generate an input field for solar day
  const solDayInput: HTMLDivElement =
    document.querySelector('#solar-day-input')!

  // * Clear previously generated data
  removeAllChildNodes(solDayInput)

  const solDaylabel = document.createElement('span')
  solDaylabel.setAttribute('class', 'input-group-text')
  solDaylabel.setAttribute('id', 'inputGroup-sizing-sm')
  solDaylabel.textContent = 'Solar day to display'
  solDayInput.appendChild(solDaylabel)

  const solDayInputField = document.createElement('input')
  solDayInputField.setAttribute('type', 'number')
  solDayInputField.setAttribute('class', 'form-control')
  solDayInputField.setAttribute('min', '0')
  solDayInputField.setAttribute('max', info.max_sol)
  solDayInputField.setAttribute('aria-label', 'Sizing example input')
  solDayInputField.setAttribute('aria-describedby', 'inputGroup-sizing-sm')
  solDayInputField.setAttribute('id', 'selected-solar-day')
  solDayInputField.setAttribute('placeholder', 'i.e. 1')
  solDayInput.appendChild(solDayInputField)

  // * Invalid feedback div
  const failureDiv = document.createElement('div')
  failureDiv.setAttribute('class', 'invalid-feedback')
  failureDiv.setAttribute('hidden', '')
  failureDiv.setAttribute('id', 'failureDiv')
  failureDiv.innerHTML = `<strong>Value of range!</strong> You can choose between <strong>0</strong> and <strong>${info.max_sol}</strong>!`
  solDayInput.appendChild(failureDiv)

  const solDayInputID = solDayInputField.getAttribute('id')!
  const failureDivID = failureDiv.getAttribute('id')!

  return [solDayInputID, failureDivID]
}
