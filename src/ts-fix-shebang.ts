#!/usr/bin/env node

import {ArgumentParser, ArgumentParserOptions} from "argparse"
import * as fs from "fs"
import * as glob from "glob"

interface ParsedArgs {
  dist: string
  verbose: boolean
}

function parse_args(): ParsedArgs {
  const apo = {
    description: "Fix TypeScript shebang",
    add_help: true,
    allow_abbrev: false,
  } as unknown as ArgumentParserOptions

  const ap = new ArgumentParser(apo)

  ap.add_argument("dist", {help: "glob of dist paths to fix"})
  ap.add_argument("--verbose", {action: "store_true", help: "show verbose messages"})

  return ap.parse_args() as ParsedArgs
}

function fix_shebang(path: string, verbose: boolean): void {
  if (verbose) {
    console.log(`Fixing shebang for ${path}`)
  }

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

function main(): void {
  const pa = parse_args()

  const paths = glob.sync(pa.dist, {nodir: true})

  for (const path of paths) {
    fix_shebang(path, pa.verbose)
  }
}

main()
