const pickFile = async (): Promise<File> => {
  return new Promise<File>((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = (event) => {
      if (input.files == null || input.files.length == 0) reject('user-cancelled')
      const [file] = input.files || []
      resolve(file)
      input.remove()
    }
    input.click()
  })
}

export { pickFile }
