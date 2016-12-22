import DS from 'ember-data';
import TransitlandSerializer from "../serializer";

export default TransitlandSerializer.extend(DS.EmbeddedRecordsMixin, {
  primaryKey: 'onestop_id'
});
