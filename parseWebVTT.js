const fs = require("fs/promises");

const parseVTT = (inputFilePath, outputFilePath)=>{

  return fs.readFile(inputFilePath, "utf-8").then((content)=>{
    const contentLines = content.split("\n")
    const parsedData = []

    for (let i=0;i<contentLines.length;i++){
      if (contentLines[i].includes("-->")){
        const convertedTime = parseTimestamp(contentLines[i])
        parsedData.push([convertedTime[0],convertedTime[1],contentLines[i+1].trim()])
      }
    }
   
    return parsedData
  }).then((parsedData)=>{
    const stringified = JSON.stringify(parsedData)
    return fs.writeFile("output.js", `const cues = ${stringified}`)
  })

}

const parseTimestamp = (timeStamp)=>{

  const trimmed = timeStamp.trim()
  const splitValues = trimmed.split(" --> ")
  const parsedTimes = []

  for (let i=0;i<splitValues.length;i++){
    const time = splitValues[i]
    const sections = time.split(":")
    const timeInSeconds = parseInt(sections[0]*60*60)+ parseInt(sections[1]*60) + parseFloat(sections[2].replace(",","."))
    parsedTimes.push(timeInSeconds)
  }

  return parsedTimes;
}

parseVTT("index.vtt", "output.js");