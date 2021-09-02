export class HttpClient {
  // eslint-disable-next-line no-useless-constructor
  constructor(private baseURL: string, private state: any) {}

  createHeaders() {
    return {
      "X-User-ID": this.state.user.id,
    }
  }

  async get(path: string) {
    const response = await fetch(`${this.baseURL}/${path}`, {
      headers: this.createHeaders(),
    })

    return await response.json()
  }

  user() {
    return this.get("users/me")
  }

  workouts(after: string) {
    return this.get(`workouts?after=${after}`)
  }
}

export function createApi(state: any) {
  return new HttpClient("http://localhost:5757", state)
}
