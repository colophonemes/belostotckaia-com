const minimatch = require('minimatch')
const debug = require('debug')('create-gallery-items')  // DEBUG=create-gallery-items
const paths = require('../../helpers/file-paths') // helper to get build system paths
const slug = require(paths.helpers('slug'))
const path = require('path')

/**
 * Create Gallery Items (Metalsmith plugin)
 *
 * Creates individual gallery item pages from images or gallery items fields 
 *
 * @param {Object}          opts - plugin options
 * @param {(Object|string)} opts.filter - a glob pattern (passed to minimatch) or a filter function compatible with Array.filter() (will be passed Metalsmith filenames)
 *
 */
function createGalleryItemsPlugin (opts) {
  const defaults = {
    // set some default options here
    filter: 'galleries/**/*.html',
    layout: 'gallery-item.pug',
    pathPrefix: 'gallery-images'
  }
  const options = Object.assign(defaults, opts)
  const filter = typeof options.filter === 'string' ? minimatch.filter(options.filter) : (a) => a

  const galleryItemFileDefaults = {
    layout: options.layout
  }

  // main plugin returned to Metalsmith
  return function createGalleryItems (files, metalsmith, done) {
    // plugin code goes here
    Object.keys(files).filter(filter).forEach((file) => {
      const gallery = files[file]
      const {galleryItems, images} = gallery.data.fields
      // ignore files that don't have images associated with them
      if (
        !(images && images.length) &&
        !(galleryItems && galleryItems.length)
      ) return
      // set some base variables
      const galleryItemFiles = []
      // add gallery items
      if (galleryItems && galleryItems.length) {
        galleryItems.forEach((galleryItem) => {
          galleryItemFiles.push(
            Object.assign({}, galleryItemFileDefaults, {
              data: galleryItem,
              image: galleryItem.fields.image
            })
          )
        })
      }
      // add standard images
      if (images && images.length) {
        images.forEach((image) => {
          galleryItemFiles.push(
            Object.assign({}, galleryItemFileDefaults, {
              data: image,
              image
            })
          )
        })
      }
      // for each gallery item...
      galleryItemFiles.forEach((galleryItemFile) => {
        galleryItemFile.gallery = gallery
        // skip files missing data
        if (!galleryItemFile.data || !galleryItemFile.data.fields) {
          console.log(galleryItemFile)
          return
        }
        // ensure a unique slug
        const fileSlug = `${slug(galleryItemFile.data.fields.title)}-${galleryItemFile.image.sys.id}`
        galleryItemFile.data.fields.slug = fileSlug
        // add as a child of the parent gallery
        galleryItemFile.data.fields.parent = gallery
        galleryItemFile.collectionSlug = 'gallery-image'
        // create a file in the build
        const filePath = `${options.pathPrefix}/${fileSlug}/index.html`
        // ensure unique file path
        files[filePath] = galleryItemFile
      })
      // add gallery item files back to the main gallery
      gallery.galleryItemFiles = galleryItemFiles
    })
    // tell Metalsmith that we're done
    done()
  }
}

module.exports = createGalleryItemsPlugin
// require this plugin in ./tasks/metalsmith using:
// const createGalleryItems = require(paths.lib('metalsmith/plugins/create-gallery-items.js'))
