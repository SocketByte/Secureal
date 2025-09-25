import { ConveyorApi } from "@/lib/preload/shared"

export class AppApi extends ConveyorApi {
  version = () => this.invoke("version")
  pingServer = (host: string) => this.invoke("pingServer", host)
}
