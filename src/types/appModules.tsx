export interface AppSubmodule {
  id: number;
  label: string;
  route: string;
}

export interface AppModule {
  id: number;
  label: string;
  submodules: AppSubmodule[];
}