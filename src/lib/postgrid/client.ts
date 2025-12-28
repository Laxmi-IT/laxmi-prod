const POSTGRID_API_URL = 'https://api.postgrid.com/print-mail/v1'
const POSTGRID_EMAIL_API_URL = 'https://api.postgrid.com/email/v1'

interface PostGridConfig {
  apiKey: string
}

interface EmailParams {
  to: string
  from: string
  subject: string
  html?: string
  text?: string
  templateId?: string
  mergeVariables?: Record<string, string>
}

interface LetterParams {
  to: {
    firstName?: string
    lastName?: string
    companyName?: string
    addressLine1: string
    addressLine2?: string
    city: string
    provinceOrState: string
    postalOrZip: string
    country: string
  }
  from: {
    firstName?: string
    lastName?: string
    companyName?: string
    addressLine1: string
    addressLine2?: string
    city: string
    provinceOrState: string
    postalOrZip: string
    country: string
  }
  html?: string
  templateId?: string
  mergeVariables?: Record<string, string>
}

class PostGridClient {
  private apiKey: string

  constructor(config: PostGridConfig) {
    this.apiKey = config.apiKey
  }

  private async request(
    url: string,
    method: string,
    body?: Record<string, unknown>
  ) {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'PostGrid API error')
    }

    return response.json()
  }

  // Email API
  async sendEmail(params: EmailParams) {
    return this.request(`${POSTGRID_EMAIL_API_URL}/emails`, 'POST', {
      to: params.to,
      from: params.from,
      subject: params.subject,
      html: params.html,
      text: params.text,
      templateId: params.templateId,
      mergeVariables: params.mergeVariables,
    })
  }

  async createEmailTemplate(
    name: string,
    html: string,
    description?: string
  ) {
    return this.request(`${POSTGRID_EMAIL_API_URL}/templates`, 'POST', {
      name,
      html,
      description,
    })
  }

  async getEmailTemplate(templateId: string) {
    return this.request(
      `${POSTGRID_EMAIL_API_URL}/templates/${templateId}`,
      'GET'
    )
  }

  async listEmailTemplates(limit = 10, skip = 0) {
    return this.request(
      `${POSTGRID_EMAIL_API_URL}/templates?limit=${limit}&skip=${skip}`,
      'GET'
    )
  }

  // Print Mail API (Letters)
  async sendLetter(params: LetterParams) {
    return this.request(`${POSTGRID_API_URL}/letters`, 'POST', {
      to: params.to,
      from: params.from,
      html: params.html,
      template: params.templateId,
      mergeVariables: params.mergeVariables,
    })
  }

  async getLetter(letterId: string) {
    return this.request(`${POSTGRID_API_URL}/letters/${letterId}`, 'GET')
  }

  async listLetters(limit = 10, skip = 0) {
    return this.request(
      `${POSTGRID_API_URL}/letters?limit=${limit}&skip=${skip}`,
      'GET'
    )
  }

  // Contacts API
  async createContact(contact: {
    firstName?: string
    lastName?: string
    email?: string
    companyName?: string
    addressLine1: string
    addressLine2?: string
    city: string
    provinceOrState: string
    postalOrZip: string
    country: string
  }) {
    return this.request(`${POSTGRID_API_URL}/contacts`, 'POST', contact)
  }

  async getContact(contactId: string) {
    return this.request(`${POSTGRID_API_URL}/contacts/${contactId}`, 'GET')
  }

  async listContacts(limit = 10, skip = 0) {
    return this.request(
      `${POSTGRID_API_URL}/contacts?limit=${limit}&skip=${skip}`,
      'GET'
    )
  }
}

let postGridClient: PostGridClient | null = null

export function getPostGridClient(): PostGridClient {
  if (!postGridClient) {
    const apiKey = process.env.POSTGRID_API_KEY
    if (!apiKey) {
      throw new Error('POSTGRID_API_KEY environment variable is not set')
    }
    postGridClient = new PostGridClient({ apiKey })
  }
  return postGridClient
}

export type { EmailParams, LetterParams }
