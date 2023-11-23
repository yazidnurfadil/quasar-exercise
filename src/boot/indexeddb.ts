import { boot } from 'quasar/wrappers';
import { useIndexedDb } from 'src/composables/indexedDb';

export default boot(async ({ app }) => {
  const { db, initDb } = useIndexedDb();
  await initDb();
  app.config.globalProperties.$idb = db;
});
