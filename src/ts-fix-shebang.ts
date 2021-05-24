#!/usr/bin/env node

import * as fs from "fs"
import {JsonObject} from "type-fest"

const LF = "\n"
const SHEBANG_OTHER = "#!"
const SHEBANG_NODE = "#!/usr/bin/env node"

const packages = JSON.parse(fs.readFileSync("package.json", "utf8")) as JsonObject

const paths: string[] = []

if (packages?.bin) {
  if (typeof packages.bin === "string") {
    paths.push(packages.bin)
  }
  if (typeof packages.bin === "object") {
    for (const value of Object.values(packages.bin)) {
      paths.push(value as string)
    }
  }
}

for (const path of paths) {
  console.log(`Fixing shebang for ${path}`)

  const text_in = fs.readFileSync(path, "utf8")

  let lines = text_in.split(/\r?\n/)

  if (lines.length && lines[0].startsWith(SHEBANG_OTHER)) {
    lines.shift()
  }

  lines.unshift(SHEBANG_NODE + LF)

  const text_out = lines.join(LF) + LF

  fs.writeFileSync(path, text_out, "utf8")
}
