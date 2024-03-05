/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { fetchBasic, fetchExpanded } from '../content'
import type {
  fetchBasicType,
  fetchExpandedType,
  responseRover
} from '../types/fetchedTypes'

/**
 * Displays camera select element with only those that were used by the rover
 * on the given day. Not all rover's have the same set of cameras, and not all
 * of them are used on any given day.
 * @param {string[]} cameraUsed Array of strings containg camera names used
 * by a rover at given day
 * @param {string} roverName Rover selected by the user
 * @param {string} selectedSolarDay Solar day selected by the user
 * @param {string} pagesCount It is a paginated api, and this number contains
 * calculated number of available pages to display.
 */
export function displayCameraSelectors(
  camerasUsed: string[],
  roverName: string,
  selectedSolarDay: string,
  pagesCount: string,
  removeAllChildNodes: (parent: HTMLElement) => void
  // fetchBasic: (args: fetchBasicType) => void,
  // fetchExpanded: (args: fetchExpandedType) => void
): void {
  const camInfo: HTMLParagraphElement = document.querySelector('#cameras-info')!
  camInfo.innerHTML =
    'Each rover has a diffent set of cameras. Select the ones that are interesting for you:'

  const camerasList: HTMLDivElement =
    document.querySelector('#camera-selectors')!
  removeAllChildNodes(camerasList)

  // *List of available cameras
  const availableCameras = {
    ENTRY: 'Entry, Descent, and Landing Camera',
    FHAZ: 'Front Hazard Avoidance Camera',
    RHAZ: 'Rear Hazard Avoidance Camera',
    MAST: 'Mast Camera',
    CHEMCAM: 'Chemistry and Camera Complex',
    MAHLI: 'Mars Hand Lens Imager',
    MARDI: 'Mars Descent Imager',
    NAVCAM: 'Navigation Camera',
    PANCAM: 'Panoramic Camera',
    MINITES: 'Miniature Thermal Emission Spectrometer (Mini-TES)'
  }

  const camSelect = document.createElement('select')
  camSelect.setAttribute('class', 'form-select')
  camSelect.setAttribute('aria-label', 'camera-select')
  camSelect.setAttribute('id', 'cam-select')
  camerasList.appendChild(camSelect)

  const selectAll = document.createElement('option')
  selectAll.setAttribute('value', 'ALL')
  selectAll.textContent = 'All cameras'
  camSelect.appendChild(selectAll)

  // *Add cameras options to a list
  camerasUsed.forEach((camera) => {
    const selectOption = document.createElement('option')
    selectOption.setAttribute('value', camera)
    selectOption.textContent =
      availableCameras[camera as keyof typeof availableCameras]
    camSelect.appendChild(selectOption)
  })

  // * Make a first fetch and then respond to select change
  const args1: fetchBasicType = {
    roverName,
    selectedSolarDay,
    pagesCount
  }
  const args2: fetchExpandedType = {
    roverName,
    selectedSolarDay,
    camName: camSelect.value
  }
  fetchBasic(args1)

  // * Basic and expanded fetch differ only selected camera passed as attribute
  camSelect.addEventListener('change', () => {
    if (camSelect.value === 'ALL') {
      fetchBasic(args1)
    } else {
      fetchExpanded(args2)
    }
  })
}
