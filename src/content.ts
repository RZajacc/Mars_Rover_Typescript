/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { displayRoverInfo } from './Utility/DisplayRoverInfo'
import { displayGallery } from './Utility/DisplayGallery'
import { PaginationFixedPages } from './Utility/PaginationFixedPages'
import { PaginationUncertainPAmount } from './Utility/PaginationUncertainPCount'
import type { responseManifest, responseRover } from './types/fetchedTypes.js'
import { displayEmptyRoverErr } from './Utility/DisplayEmptyRoverErr'
import {
  cleanAllDynamicContent,
  removeAllChildNodes
} from './Utility/DOMCleaners'

// ? ----------------------------------------------------------------------
// ? SELECTING ROVER - Serves as a root call for everytning that comes next
// ? ----------------------------------------------------------------------
/**
 * It queries select field on the page containing a string with a name
 * of a rover to display data for. In case none was selected it will trigger
 * a function do display error with a message provided manually. If it is selected
 * properly it will fetch data from NASA API's mission manifest containing information
 * describing selected rover's mission and pass it to a function that will display it
 * on the page
 */
interface utilFuncs {
  displayEmptyRoverErr: (
    message: string,
    cleanAllDynamicContent: () => void
  ) => void
  cleanAllDynamicContent: () => void
  removeAllChildNodes: (parent: HTMLElement) => void
}
export const chooseRover = (args: utilFuncs): void => {
  //* Query select field from document
  const roverSelect: HTMLSelectElement =
    document.querySelector('#rover-select')!
  // * Add an event listenet to it and get selected value
  roverSelect.addEventListener('change', (e) => {
    const target = e.target as HTMLSelectElement
    const roverName = target.value

    // * In case nothing was selected display an error
    if (roverName === '') {
      args.displayEmptyRoverErr(
        'Nothing to display! Please select a rover!',
        args.cleanAllDynamicContent
      )
      // * If rover was selected fetch data from its mission manifest entry
    } else {
      // * Fetch mission manifest
      const manifestUrl = `https://api.nasa.gov/mars-photos/api/v1/manifests/${roverName}/?api_key=wlcQTmhFQql1kb762xbFcrn8imjFFLumfDszPmsi`
      fetch(manifestUrl)
        .then(async (response) => await response.json())
        .then((data: responseManifest) => {
          displayRoverInfo(
            data.photo_manifest,
            roverName,
            cleanAllDynamicContent,
            removeAllChildNodes
          )
        })
        .catch((error) => {
          console.log(error)
        })
    }
  })
}
// * INIT the function
chooseRover({
  displayEmptyRoverErr,
  cleanAllDynamicContent,
  removeAllChildNodes
})

// ? ----------------------------------------------------------------------
// ? FETCHING DATA - Functions are called in several places but since they
// ? they are connected with displaying images I decided to keep them here
// ? for better readability.
// ? ----------------------------------------------------------------------

// ? -----------------------------------------------------------------------
// ? DISPLAYING IMAGES - Functions are called only by fetching corresponding
// ? fetching methods. Logic in both methods is similar but it differs a bit
// ? in pagination and therefore it was easier to divide them in two.
// ? -----------------------------------------------------------------------
/**
 * Called only by basic fetch function. It receives the data required
 * to display gallery, and prepares the area for it. To display the images
 * it calls displayGallery function. Then it calles also pagination in a version
 * fitting to this kind of fetch.
 * @param {responseRover} data Data fetched from the API
 * @param {string} roverName Rover selected by the user
 * @param {string} selectedSolarDay Solar day selected by the user
 * @param {string} pagesCount Calculated amount of pages available to display
 * @param {string} page Page user is currently on (default=1).
 */
export function showAllPhotos(
  data: responseRover,
  roverName: string,
  selectedSolarDay: string,
  pagesCount: string,
  page: string
): void {
  // * Get the gallery div and clean it from existing content
  const photoDiv: HTMLDivElement = document.querySelector('#photo-gallery')!
  removeAllChildNodes(photoDiv)
  const pagesDiv: HTMLDivElement = document.querySelector('#pages')!
  removeAllChildNodes(pagesDiv)

  // *Create a div containing cards group
  const cardGroup = document.createElement('div')
  cardGroup.setAttribute('class', 'row row-cols-1 row-cols-md-2 g-3')
  photoDiv.appendChild(cardGroup)

  // *Displaying photos is called from few places
  displayGallery(cardGroup, data)

  // *Display pagination for fixed and known amount of pages
  PaginationFixedPages(
    photoDiv,
    pagesDiv,
    pagesCount,
    roverName,
    selectedSolarDay,
    page
  )
}

/**
 * Called only by expanded fetch function. It receives the data required
 * to display gallery, and prepares the area for it. To display the images
 * it calls displayGallery function. Then it calles also pagination in a version
 * fitting to this kind of fetch.
 * @param {responseRover} data Data fetched from the API
 * @param {string} roverName Rover selected by the user
 * @param {string} selectedSolarDay Solar day selected by the user
 * @param {string} camName Name of the camera selected
 * @param {string} page Page user is currently on (default=1).
 */
export function showSelectedPhotos(
  data: responseRover,
  roverName: string,
  selectedSolarDay: string,
  camName: string,
  page: string
): void {
  // * Get the gallery div and clean it from existing content
  const photoDiv: HTMLDivElement = document.querySelector('#photo-gallery')!
  removeAllChildNodes(photoDiv)
  const pagesDiv: HTMLDivElement = document.querySelector('#pages')!
  removeAllChildNodes(pagesDiv)

  // *Create a div containing cards group
  const cardGroup = document.createElement('div')
  cardGroup.setAttribute('class', 'row row-cols-1 row-cols-md-2 g-3')
  photoDiv.appendChild(cardGroup)

  // *Gallery is displayed from more places
  displayGallery(cardGroup, data)

  // * Display pagination for uncertain amount of pages
  PaginationUncertainPAmount(
    photoDiv,
    data,
    roverName,
    selectedSolarDay,
    camName,
    page
  )
}
