declare namespace NodeJS {
  interface Process {
    server: boolean;
  }
}

declare module "*.svg" {
  const content: any;

  export default content;
}
