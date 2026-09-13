export const CERTIFICATIONS = [
  {
    slug: 'ml-engineer',
    code: 'MLA-C01',
    shortName: 'ML Engineer',
    name: 'Machine Learning Engineer',
    provider: 'AWS',
  },
  {
    slug: 'cloud-practitioner',
    code: 'CLF-C02',
    shortName: 'Cloud Practitioner',
    name: 'Cloud Practitioner',
    provider: 'AWS',
  },
] as const

export type CertSlug = (typeof CERTIFICATIONS)[number]['slug']

export const CERT_SLUGS = CERTIFICATIONS.map((cert) => cert.slug)

export const LAST_CERT_STORAGE_KEY = 'last-certification'

export const WORKSPACE_SECTIONS = ['dashboard', 'questions', 'tests', 'history'] as const

export type WorkspaceSection = (typeof WORKSPACE_SECTIONS)[number]

export function isCertSlug(value: string | undefined | null): value is CertSlug {
  return !!value && (CERT_SLUGS as readonly string[]).includes(value)
}

export function isWorkspaceSection(value: string | undefined | null): value is WorkspaceSection {
  return !!value && (WORKSPACE_SECTIONS as readonly string[]).includes(value)
}

export function getCertBySlug(slug: string | undefined | null) {
  return CERTIFICATIONS.find((cert) => cert.slug === slug)
}

export function getCertByCode(code: string | undefined | null) {
  return CERTIFICATIONS.find((cert) => cert.code === code)
}

export function getCertSlugFromCode(code: string | undefined | null): CertSlug | undefined {
  return getCertByCode(code)?.slug
}
