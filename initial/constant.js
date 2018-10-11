const timeNow = new Date().getTime()

export const privateFields = {
  _status: { type: Number, default: 1 },
  _created_at: { type: Date, default: timeNow },
  _updated_at: { type: Date, default: timeNow },
  _deleted_at: { type: Number, default: 0 },
  versionKey: false
}
export const expiresIn = 60 * 60 * 24 * 7
