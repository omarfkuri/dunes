export interface TsConfig {
  extends?: string
  exclude?: string[]
  include?: string[]
  files?: string[]
  "ts-node"?: any
  compilerOptions: {
    /* Visit https://aka.ms/tsconfig to read more about this file */

    /* Projects */

    /**
     * Save .tsbuildinfo files to allow for incremental compilation of projects. 
     * */
    incremental?: boolean
    /**
     * Enable constraints that allow a TypeScript project to be used with project references. 
     * */
    composite?: boolean
    /**
     * Specify the path to .tsbuildinfo incremental compilation file. 
     * */
    tsBuildInfoFile?: string
    /**
     * Disable preferring source files instead of declaration files when referencing composite projects. 
     * */
    disableSourceOfProjectReferenceRedirect?: boolean
    /**
     * Opt a project out of multi-project reference checking when editing. 
     * */
    disableSolutionSearching?: boolean
    /**
     * Reduce the number of projects loaded automatically by TypeScript. 
     * */
    disableReferencedProjectLoad?: boolean

    /* Language and Environment */

    /**
     * Set the JavaScript language version for emitted JavaScript and include compatible library declarations. 
     * */
    target?: ScriptTarget
    /**
     * Specify a set of bundled library declaration files that describe the target runtime environment. 
     * */
    lib?: string[],                                        
    /**
     * Specify what JSX code is generated. 
     * */
    jsx?: JsxEmit
    /**
     * Enable experimental support for legacy experimental decorators. 
     * */
    experimentalDecorators?: boolean
    /**
     * Emit design-type metadata for decorated declarations in source files. 
     * */
    emitDecoratorMetadata?: boolean
    /**
     * Specify the JSX factory function used when targeting React JSX emit, e.g. 'React.createElement' or 'h'. 
     * */
    jsxFactory?: string
    /**
     * Specify the JSX Fragment reference used for fragments when targeting React JSX emit e.g. 'React.Fragment' or 'Fragment'. 
     * */
    jsxFragmentFactory?: string
    /**
     * Specify module specifier used to import the JSX factory functions when using 'jsx?: react-jsx*'. 
     * */
    jsxImportSource?: string
    /**
     * Specify the object invoked for 'createElement'. This only applies when targeting 'react' JSX emit. 
     * */
    reactNamespace?: string
    /**
     * Disable including any library files, including the default lib.d.ts. 
     * */
    noLib?: boolean
    /**
     * Emit ECMAScript-standard-compliant class fields. 
     * */
    useDefineForClassFields?: boolean
    /**
     * Control what method is used to detect module-format JS files. 
     * */
    moduleDetection?: string

    /* Modules */

    /**
     * Specify what module code is generated. 
     * */
    module?: ModuleKind
    /**
     * Specify the root folder within your source files. 
     * */
    rootDir?: string
    /**
     * Specify how TypeScript looks up a file from a given module specifier. 
     * */
    moduleResolution?: ModuleResolutionKind
    /**
     * Specify the base directory to resolve non-relative module names. 
     * */
    baseUrl?: string
    /**
     * Specify a set of entries that re-map imports to additional lookup locations. 
     * */
    paths?: {
      [key: string]: string[]
    },                                      
    /**
     * Allow multiple folders to be treated as one when resolving modules. 
     * */
    rootDirs?: string[],                                   
    /**
     * Specify multiple folders that act like './node_modules/@types'. 
     * */
    typeRoots?: string[],                                  
    /**
     * Specify type package names to be included without being referenced in a source file. 
     * */
    types?: string[],                                      
    /**
     * Allow accessing UMD globals from modules. 
     * */
    allowUmdGlobalAccess?: boolean
    /**
     * List of file name suffixes to search when resolving a module. 
     * */
    moduleSuffixes?: string[],                             
    /**
     * Allow imports to include TypeScript file extensions. Requires '--moduleResolution bundler' and either '--noEmit' or '--emitDeclarationOnly' to be set. 
     * */
    allowImportingTsExtensions?: boolean
    /**
     * Use the package.json 'exports' field when resolving package imports. 
     * */
    resolvePackageJsonExports?: boolean
    /**
     * Use the package.json 'imports' field when resolving imports. 
     * */
    resolvePackageJsonImports?: boolean
    /**
     * Conditions to set in addition to the resolver-specific defaults when resolving imports. 
     * */
    customConditions?: string[],                           
    /**
     * Enable importing .json files. 
     * */
    resolveJsonModule?: boolean
    /**
     * Enable importing files with any extension, provided a declaration file is present. 
     * */
    allowArbitraryExtensions?: boolean
    /**
     * Disallow 'import's, 'require's or '<reference>'s from expanding the number of files TypeScript should add to a project. 
     * */
    noResolve?: boolean

    /* JavaScript Support */
    /**
     * Allow JavaScript files to be a part of your program. Use the 'checkJS' option to get errors from these files. 
     * */
    allowJs?: boolean
    /**
     * Enable error reporting in type-checked JavaScript files. 
     * */
    checkJs?: boolean
    /**
     * Specify the maximum folder depth used for checking JavaScript files from 'node_modules'. Only applicable with 'allowJs'. 
     * */
    maxNodeModuleJsDepth?: number                        

    /* Emit */
    /**
     * Generate .d.ts files from TypeScript and JavaScript files in your project. 
     * */
    declaration?: boolean
    /**
     * Create sourcemaps for d.ts files. 
     * */
    declarationMap?: boolean
    /**
     * Only output d.ts files and not JavaScript files. 
     * */
    emitDeclarationOnly?: boolean
    /**
     * Create source map files for emitted JavaScript files. 
     * */
    sourceMap?: boolean
    /**
     * Include sourcemap files inside the emitted JavaScript. 
     * */
    inlineSourceMap?: boolean
    /**
     * Specify a file that bundles all outputs into one JavaScript file. If 'declaration' is true, also designates a file that bundles all .d.ts output. 
     * */
    outFile?: string
    /**
     * Specify an output folder for all emitted files. 
     * */
    outDir?: string
    /**
     * Disable emitting comments. 
     * */
    removeComments?: boolean
    /**
     * Disable emitting files from a compilation. 
     * */
    noEmit?: boolean
    /**
     * Allow importing helper functions from tslib once per project, instead of including them per-file. 
     * */
    importHelpers?: boolean
    /**
     * Specify emit/checking behavior for imports that are only used for types. 
     * */
    importsNotUsedAsValues?: ImportsNotUsedAsValues
    /**
     * Emit more compliant, but verbose and less performant JavaScript for iteration. 
     * */
    downlevelIteration?: boolean
    /**
     * Specify the root path for debuggers to find the reference source code. 
     * */
    sourceRoot?: string
    /**
     * Specify the location where debugger should locate map files instead of generated locations. 
     * */
    mapRoot?: string
    /**
     * Include source code in the sourcemaps inside the emitted JavaScript. 
     * */
    inlineSources?: boolean
    /**
     * Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files. 
     * */
    emitBOM?: boolean
    /**
     * Set the newline character for emitting files. 
     * */
    newLine?: NewLineKind
    /**
     * Disable emitting declarations that have '@internal' in their JSDoc comments. 
     * */
    stripInternal?: boolean
    /**
     * Disable generating custom helper functions like '__extends' in compiled output. 
     * */
    noEmitHelpers?: boolean
    /**
     * Disable emitting files if any type checking errors are reported. 
     * */
    noEmitOnError?: boolean
    /**
     * Disable erasing 'const enum' declarations in generated code. 
     * */
    preserveConstEnums?: boolean
    /**
     * Specify the output directory for generated declaration files. 
     * */
    declarationDir?: string
    /**
     * Preserve unused imported values in the JavaScript output that would otherwise be removed. 
     * */
    preserveValueImports?: boolean

    /* Interop Constraints */
    /**
     * Ensure that each file can be safely transpiled without relying on other imports. 
     * */
    isolatedModules?: boolean
    /**
     * Do not transform or elide any imports or exports not marked as type-only, ensuring they are written in the output file's format based on the 'module' setting. 
     * */
    verbatimModuleSyntax?: boolean
    /**
     * Allow 'import x from y' when a module doesn't have a default export. 
     * */
    allowSyntheticDefaultImports?: boolean
       /**
        * Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. 
        * */
    esModuleInterop?: boolean
    /**
     * Disable resolving symlinks to their realpath. This correlates to the same flag in node. 
     * */
    preserveSymlinks?: boolean
       /**
        * Ensure that casing is correct in imports. 
        * */
    forceConsistentCasingInFileNames?: boolean

    /* Type Checking */
    /**
     * Enable all strict type-checking options. 
     * */
    strict?: boolean
    /**
     * Enable error reporting for expressions and declarations with an implied 'any' type. 
     * */
    noImplicitAny?: boolean
    /**
     * When type checking, take into account 'null' and 'undefined'. 
     * */
    strictNullChecks?: boolean
    /**
     * When assigning functions, check to ensure parameters and the return values are subtype-compatible. 
     * */
    strictFunctionTypes?: boolean
    /**
     * Check that the arguments for 'bind', 'call', and 'apply' methods match the original function. 
     * */
    strictBindCallApply?: boolean
    /**
     * Check for class properties that are declared but not set in the constructor. 
     * */
    strictPropertyInitialization?: boolean
    /**
     * Enable error reporting when 'this' is given the type 'any'. 
     * */
    noImplicitThis?: boolean
    /**
     * Default catch clause variables as 'unknown' instead of 'any'. 
     * */
    useUnknownInCatchVariables?: boolean
    /**
     * Ensure 'use strict' is always emitted. 
     * */
    alwaysStrict?: boolean
    /**
     * Enable error reporting when local variables aren't read. 
     * */
    noUnusedLocals?: boolean
    /**
     * Raise an error when a function parameter isn't read. 
     * */
    noUnusedParameters?: boolean
    /**
     * Interpret optional property types as written, rather than adding 'undefined'. 
     * */
    exactOptionalPropertyTypes?: boolean
    /**
     * Enable error reporting for codepaths that do not explicitly return in a function. 
     * */
    noImplicitReturns?: boolean
    /**
     * Enable error reporting for fallthrough cases in switch statements. 
     * */
    noFallthroughCasesInSwitch?: boolean
    /**
     * Add 'undefined' to a type when accessed using an index. 
     * */
    noUncheckedIndexedAccess?: boolean
    /**
     * Ensure overriding members in derived classes are marked with an override modifier. 
     * */
    noImplicitOverride?: boolean
    /**
     * Enforces using indexed accessors for keys declared using an indexed type. 
     * */
    noPropertyAccessFromIndexSignature?: boolean
    /**
     * Disable error reporting for unused labels. 
     * */
    allowUnusedLabels?: boolean
    /**
     * Disable error reporting for unreachable code. 
     * */
    allowUnreachableCode?: boolean

    /* Completeness */
    /**
     * Skip type checking .d.ts files that are included with TypeScript. 
     * */
    skipDefaultLibCheck?: boolean
    /**
     * Skip type checking all .d.ts files. 
     * */
    skipLibCheck?: true                              
  }
}


type ModuleKind = (
  | "None"
  | "CommonJS"
  | "AMD"
  | "UMD"
  | "System"
  | "ES2015"
  | "ES2020"
  | "ES2022"
  | "ESNext"
  | "Node16"
  | "NodeNext"
)
type JsxEmit = (
  | "None"
  | "Preserve"
  | "React"
  | "ReactNative"
  | "ReactJSX"
  | "ReactJSXDev"
)
type ImportsNotUsedAsValues = (
  | "Remove"
  | "Preserve"
  | "Error"
)
type NewLineKind = (
  | "CarriageReturnLineFeed"
  | "LineFeed"
)
type ScriptTarget = (
  | "ES3"
  | "ES5"
  | "ES2015"
  | "ES2016"
  | "ES2017"
  | "ES2018"
  | "ES2019"
  | "ES2020"
  | "ES2021"
  | "ES2022"
  | "ESNext"
  | "JSON"
  | "Latest"
)
type ModuleResolutionKind = (
  | "NodeJs"
  | "Node10"
  | "Node16"
  | "NodeNext"
  | "Bundler"
)