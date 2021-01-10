import { connect} from 'mongoose'

export default async () => {
    const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.5ui2q.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
    await connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
}