/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { imageDisplaySection } from '../content'
import type { utilFuncs } from '../types/utilTypes'

/**
 * Displays bootrap pagination on the bottom of the page. This option is used
 * when user selects a camera. In this case it's impossible to say how many
 * pages are available (without making big amount of requests to the the server).
 * Becayse of that logic and form of displaying pagination differs a bit from the
 * one without selected camera. Each time user changes a page to be displayed another
 * piece of data is fetched from the API
 * @param {number} imagesAmount Total amount of images
 * @param {string} roverName Rover name selected by the user.
 * @param {string} selectedSolarDay Solar day selected by the user.
 * @param {string} camName Selected camera name
 * @param {string} pagesCount Total amount of pages available
 * @param {string} page Current page fethed from the API (page is a attribute
 * for a fetch)
 * @param {utilFuncs} utils Collection of utility functions
 */
export async function paginationUncertainPCount(
  imagesAmount: number,
  roverName: string,
  selectedSolarDay: string,
  camName: string,
  pagesCount: string,
  page: string,
  utils: utilFuncs
): Promise<void> {
  // Get the gallery and pagination div
  const photoDiv = document.getElementById('photo-gallery') as HTMLDivElement
  // If requested page is empty then move to last working one (Pagination)
  if (imagesAmount === 0) {
    const targetPage = +page - 1
    utils.removeAllChildNodes(photoDiv)
    const imagesData = await utils.fetchImages(
      roverName,
      selectedSolarDay,
      camName,
      targetPage.toString()
    )
    await imageDisplaySection(
      imagesData,
      roverName,
      selectedSolarDay,
      pagesCount,
      camName,
      targetPage.toString(),
      utils
    )
  } else {
    // Max images per page is 25. Therefor pagination is needed when where on different page than 1, or amount of images is max
    // since then probably page 2 exists
    if (imagesAmount === 25 || +page !== 1) {
      // ? Create navigation and Previous element tab
      const pagesDiv: HTMLDivElement = document.querySelector('#pages')!
      const paginationNav = document.createElement('nav')
      paginationNav.setAttribute('aria-label', 'pagination-nav')
      pagesDiv.appendChild(paginationNav)
      const paginationUl = document.createElement('ul')
      paginationUl.setAttribute('class', 'pagination justify-content-center')
      paginationNav.appendChild(paginationUl)

      // Create a move to a FIRST PAGE element
      const firstLi = document.createElement('li')
      firstLi.setAttribute('class', 'page-item')
      const firstHref = document.createElement('a')
      firstHref.setAttribute('class', 'page-link')
      firstHref.setAttribute('href', '#')
      firstHref.textContent = 'First Page'
      firstLi.appendChild(firstHref)
      paginationUl.appendChild(firstLi)

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      firstHref.addEventListener('click', async () => {
        const targetPage = '1'
        utils.removeAllChildNodes(photoDiv)
        const imagesData = await utils.fetchImages(
          roverName,
          selectedSolarDay,
          camName,
          targetPage.toString()
        )
        await imageDisplaySection(
          imagesData,
          roverName,
          selectedSolarDay,
          pagesCount,
          camName,
          targetPage,
          utils
        )
      })

      // Create a move to a PREVIOUS PAGE element
      const previousLi = document.createElement('li')
      previousLi.setAttribute('class', 'page-item')
      const previousHref = document.createElement('a')
      previousHref.setAttribute('class', 'page-link')
      previousHref.setAttribute('href', '#')
      previousHref.textContent = 'Previous'
      previousLi.appendChild(previousHref)
      paginationUl.appendChild(previousLi)

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      previousHref.addEventListener('click', async () => {
        if (+page > 1) {
          const targetPage = +page - 1
          utils.removeAllChildNodes(photoDiv)
          const imagesData = await utils.fetchImages(
            roverName,
            selectedSolarDay,
            camName,
            targetPage.toString()
          )
          await imageDisplaySection(
            imagesData,
            roverName,
            selectedSolarDay,
            pagesCount,
            camName,
            targetPage.toString(),
            utils
          )
        }
      })

      // Create a CURRENT PAGE element
      const currentLi = document.createElement('li')
      currentLi.setAttribute('class', 'page-item')
      const currentHref = document.createElement('a')
      currentHref.setAttribute('class', 'page-link disabled')
      currentHref.setAttribute('href', '')
      currentHref.textContent = page
      currentLi.appendChild(currentHref)
      paginationUl.appendChild(currentLi)

      // Create a move to NEXT element
      const nextLi = document.createElement('li')
      nextLi.setAttribute('class', 'page-item')
      const nextHref = document.createElement('a')
      nextHref.setAttribute('class', 'page-link')
      nextHref.setAttribute('href', '#')
      nextHref.textContent = 'Next Page'
      nextLi.appendChild(nextHref)
      paginationUl.appendChild(nextLi)

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      nextHref.addEventListener('click', async () => {
        const targetPage = +page + 1
        utils.removeAllChildNodes(photoDiv)
        const imagesData = await utils.fetchImages(
          roverName,
          selectedSolarDay,
          camName,
          targetPage.toString()
        )
        await imageDisplaySection(
          imagesData,
          roverName,
          selectedSolarDay,
          pagesCount,
          camName,
          targetPage.toString(),
          utils
        )
      })
    }
  }
}
