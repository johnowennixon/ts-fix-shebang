#!/usr/bin/env node

import {ArgumentParser} from "argparse"
import * as fs from "fs"
import * as glob from "glob"

interface ParsedArgs {
  dist: string
}

function parse_args(): ParsedArgs {
  const ap = new ArgumentParser({description: "Fix TypeScript shebang", add_help: true})

  ap.add_argument("dist")

  return ap.parse_args() as ParsedArgs
}

function fix_shebang(path: string): void {
  console.log(`Fixing shebang for ${path}`)

  const text_in = fs.readFileSync(path, {encoding: "utf8"})

  let lines = text_in.split(/\r?\n/)

  const SHEBANG_OTHER = "#!/"
  const SHEBANG_NODE = "#!/usr/bin/env node"

  if (lines.length && lines[0].startsWith(SHEBANG_OTHER)) {
    lines[0] = SHEBANG_NODE
  }

  const LF = "\n"

  const text_out = lines.join(LF) + LF

  fs.writeFileSync(path, text_out, {encoding: "utf8"})
}

const pa = parse_args()

const paths = glob.sync(pa.dist, {nodir: true})

for (const path of paths) {
  fix_shebang(path)
}
