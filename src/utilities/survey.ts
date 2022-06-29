import { Env } from 'env'

export const getSurveyUrlById = (id: number) =>
  `${Env.api.base}/private/surveyparticipation/${id}`
