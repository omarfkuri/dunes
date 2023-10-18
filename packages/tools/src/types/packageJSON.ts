

export interface PackageJson extends PackModule {
  name: string;
  version: string;
  description?: string;
  type?: "module" | "commonjs"
  keywords?: string | string[];
  homepage?: string;
  bugs?: PackageJsonAddress;
  license?: string;
  author?: string | PackageJsonPerson;
  contributors?: string[] | PackageJsonPerson[];
  files?: string[];
  main?: string;
  types?: string;
  typings?: string;
  import?: string;
  browser?: string;
  exports?: {
    [key: string]: PackModule
  } | string;
  bin?: {
    [key: string]: string
  } | string;
  man?: string;
  directories?: {
    lib?: string;
    bin?: string;
    man?: string;
    doc?: string;
    example?: string;
    test?: string;
  };
  repository?: {
    type?: 'git';
    url?: string;
    directory?: string;
  };
  scripts?: {
    [key: string]: string
  };
  config?: {
    [key: string]: string
  };
  dependencies?: {
    [key: string]: string
  };
  devDependencies?: {
    [key: string]: string
  };
  peerDependencies?: {
    [key: string]: string
  };
  optionalDependencies?: {
    [key: string]: string
  };
  bundledDependencies?: string[];
  engines?: {
    [key: string]: string
  };
  os?: string[];
  cpu?: string[];
}

export interface PackageJsonAddress {
  email?: string;
  url?: string;
}

export interface PackageJsonPerson extends PackageJsonAddress {
  name: string;
}

export interface PackModule {
  main?: string;
  types?: string;
  import?: string;
}