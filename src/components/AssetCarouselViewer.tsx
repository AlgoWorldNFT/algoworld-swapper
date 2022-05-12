import { Asset } from '@/models/Asset';
import { observer } from 'mobx-react-lite';
import Carousel from 'react-material-ui-carousel';
import AssetAmountPickerCard from './AssetAmountPickerCard';

type Props = {
  assets: Asset[];
};

const AssetCarouselViewer = observer(({ assets }: Props) => {
  return (
    <Carousel>
      {assets.map((asset, index) => (
        <AssetAmountPickerCard key={index} asset={asset} />
      ))}
    </Carousel>
  );
});

export default AssetCarouselViewer;
