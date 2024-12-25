import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense(
  'Ngo9BigBOggjHTQxAR8/V1NHaF5cWWdCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdgWH1cdnRSRWNcUkB0V0E='
);

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.log(err));

defineCustomElements(window);
