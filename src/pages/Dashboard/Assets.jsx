import { useState } from 'react';
import { Plus, Pencil, Trash2, FileText, FileCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import LoadingPage from '@/components/Loading/Loading';
import { ImageUploader } from '@/utils/ImageUploader';
import { useCreateAssetMutation, useDeleteAssetMutation, useGetAssetQuery, useUpdateAssetMutation } from '@/services/Asset.services';
import { formatDate } from '@/utils/FormatDate';

export default function AssetsPage() {
  const [openModal, setOpenModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

  // API hooks
  const [createAsset] = useCreateAssetMutation();
  const [updateAsset] = useUpdateAssetMutation();
  const [deleteAsset, { isLoading: deleteLoading }] = useDeleteAssetMutation();

  // Preview state
  const [preview, setPreview] = useState({ open: false, type: null, urls: [], index: 0, name: '' });

  const openPreview = (type, urls, index = 0, name = '') => {
    const urlArray = Array.isArray(urls) ? urls : [urls];
    setPreview({ open: true, type, urls: urlArray, index, name });
  };

  const closePreview = () => setPreview({ open: false, type: null, urls: [], index: 0, name: '' });
  const prevPreview = () => setPreview((p) => ({ ...p, index: p.index === 0 ? p.urls.length - 1 : p.index - 1 }));
  const nextPreview = () => setPreview((p) => ({ ...p, index: p.index === p.urls.length - 1 ? 0 : p.index + 1 }));

  const getFileName = (urlOrName) => {
    if (!urlOrName) return '';
    try {
      const u = new URL(urlOrName);
      return decodeURIComponent(u.pathname.split('/').pop());
    } catch {
      return urlOrName;
    }
  };

  const { data: getAssetData, isLoading: getAssetDataLoading, refetch: refetchAssets } = useGetAssetQuery();

  const handleSave = async (asset) => {
    try {
      if (editingAsset) await updateAsset({ id: editingAsset._id, data:asset }).unwrap();
      else await createAsset(asset).unwrap();
      await refetchAssets();
      setOpenModal(false);
      setEditingAsset(null);
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) return;
    try {
      await deleteAsset(id).unwrap();
      await refetchAssets();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  if (getAssetDataLoading) return <LoadingPage />;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Assets</h1>
        <button
          onClick={() => {
            setEditingAsset(null);
            setOpenModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
        >
          <Plus size={18} /> Add Asset
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-200">
        <table className="w-full text-sm text-left min-w-[600px]">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3">Asset ID</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Purchase Date</th>
              <th className="px-4 py-3">Warranty</th>
              <th className="px-4 py-3">Specification</th>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Images</th>
              <th className="px-4 py-3">Warranty Card</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {getAssetData?.data?.map((asset) => {
              const images = Array.isArray(asset.product_image) ? asset.product_image : asset.product_image ? [asset.product_image] : [];
              const visibleThumbs = images.slice(0, 3);
              const remainingCount = Math.max(0, images.length - visibleThumbs.length);

              return (
                <tr key={asset.assets_id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{asset.assets_id}</td>
                  <td className="px-4 py-3">{asset.product_name}</td>
                  <td className="px-4 py-3">{asset.brand_name}</td>
                  <td className="px-4 py-3">{asset.assets_types}</td>
                  <td className="px-4 py-3">{formatDate(asset.purchase_date)}</td>
                  <td className="px-4 py-3">{formatDate(asset.warranty)}</td>
                  <td className="px-4 py-3">{asset.specification}</td>

                  {/* Invoice */}
                  <td className="px-4 py-3">
                    {asset.attached_invoice ? (
                      <button
                        onClick={() => openPreview('file', [asset.attached_invoice], 0, getFileName(asset.attached_invoice))}
                        className="flex items-center gap-2 text-blue-600 hover:underline truncate max-w-[160px]"
                      >
                        <FileText size={16} />
                        <span className="truncate">{getFileName(asset.attached_invoice)}</span>
                      </button>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>

                  {/* Images */}
                  <td className="px-4 py-3">
                    {images.length === 0 ? (
                      <span className="text-gray-400">No images</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="grid grid-cols-3 gap-2">
                          {visibleThumbs.map((img, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => openPreview('image', images, i)}
                              className="w-10 h-10 rounded overflow-hidden border-2 border-gray-100 hover:scale-105 transform transition"
                              aria-label={`Preview image ${i + 1}`}
                            >
                              <img src={img} alt={`asset-${i}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>

                        {remainingCount > 0 && (
                          <button
                            type="button"
                            onClick={() => openPreview('image', images, 3)}
                            className="ml-2 inline-flex items-center justify-center bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                            title={`${images.length} images`}
                          >
                            +{remainingCount}
                          </button>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Warranty Card */}
                  <td className="px-4 py-3">
                    {asset.warranty_card ? (
                      <button
                        onClick={() => openPreview('file', [asset.warranty_card], 0, getFileName(asset.warranty_card))}
                        className="flex items-center gap-2 text-green-600 hover:underline truncate max-w-[160px]"
                      >
                        <FileCheck size={16} />
                        <span className="truncate">{getFileName(asset.warranty_card)}</span>
                      </button>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingAsset(asset);
                          setOpenModal(true);
                        }}
                        className="p-2 text-blue-500 hover:text-blue-800 rounded-lg"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(asset._id)}
                        className="p-2 text-red-500 hover:text-red-800 rounded-lg"
                        disabled={deleteLoading}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Asset Modal */}
      {openModal && (
        <AssetModal
          onClose={() => {
            setOpenModal(false);
            setEditingAsset(null);
          }}
          onSave={handleSave}
          asset={editingAsset}
        />
      )}

      {/* Preview Modal */}
      {preview.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] flex flex-col relative">
            <div className="flex justify-between items-center p-3 border-b">
              <div className="text-sm font-medium truncate">{preview.name || `Item ${preview.index + 1}`}</div>
              <button onClick={closePreview} className="text-gray-600 px-2 py-1 hover:text-gray-900">
                 ✕
              </button>
            </div>

            <div className="flex items-center justify-center relative p-4 flex-1">
              {preview.urls.length > 0 && (
                <>
                  <button onClick={prevPreview} className="absolute left-2 text-white text-3xl bg-black/30 p-2 rounded-full hover:bg-black/50">
                    <ChevronLeft />
                  </button>

                  {preview.type === 'image' ? (
                    <img src={preview.urls[preview.index]} alt={`Preview ${preview.index + 1}`} className="max-h-[80vh] object-contain rounded-lg" />
                  ) : (
                    <iframe src={preview.urls[preview.index]} className="w-full h-[80vh]" title={preview.name}></iframe>
                  )}

                  <button onClick={nextPreview} className="absolute right-2 text-white text-3xl bg-black/30 p-2 rounded-full hover:bg-black/50">
                    <ChevronRight />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== Modal ====================
function AssetModal({ onClose, onSave, asset }) {
  const [form, setForm] = useState(
    asset || {
      product_name: '',
      purchase_date: '',
      warranty: '',
      brand_name: '',
      assets_types: '',
      specification: '',
      company_name: '',
      attached_invoice: null,
      product_image: [],
      warranty_card: null,
    },
  );

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      if (name === 'product_image') setForm({ ...form, [name]: [...files] });
      else setForm({ ...form, [name]: files[0] });
    } else setForm({ ...form, [name]: value });
  };

  const handleSave = async () => {
    let data = { ...form };

    // Upload files
    if (data?.attached_invoice && !asset) {
      const fd = new FormData();
      fd.append('file', data.attached_invoice);
      data.attached_invoice = await ImageUploader(fd);
    }

    if (data?.warranty_card && !asset) {
      const fd = new FormData();
      fd.append('file', data.warranty_card);
      data.warranty_card = await ImageUploader(fd);
    }

    if (data?.product_image?.length > 0  && !asset) {
      const uploadTasks = data.product_image.map((file) => {
        const fd = new FormData();
        fd.append('file', file);
        return ImageUploader(fd);
      });
      data.product_image = await Promise.all(uploadTasks);
    }

    onSave(data);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{asset ? 'Edit Asset' : 'Add Asset'}</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input type="text" name="product_name" value={form.product_name} onChange={handleChange} className="border border-gray-400 p-2 rounded-lg w-full" placeholder="Enter product name" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
            <input type="date" name="purchase_date" value={form.purchase_date} onChange={handleChange} className="border border-gray-400 p-2 rounded-lg w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Warranty Expiry</label>
            <input type="date" name="warranty" value={form.warranty} onChange={handleChange} className="border border-gray-400 p-2 rounded-lg w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
            <input type="text" name="brand_name" value={form.brand_name} onChange={handleChange} className="border border-gray-400 p-2 rounded-lg w-full" placeholder="Enter brand name" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type</label>
            <input type="text" name="assets_types" value={form.assets_types} onChange={handleChange} className="border border-gray-400 p-2 rounded-lg w-full" placeholder="Enter asset type" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <select name="company_name" value={form.company_name} onChange={handleChange} className="border border-gray-400 p-2 rounded-lg w-full">
              <option value="">-- Select Company --</option>
              <option value="Dryish ercs">Dryish ercs</option>
              <option value="Deepnap Softech">Deepnap Softech</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Specification</label>
            <textarea name="specification" value={form.specification} onChange={handleChange} className="border border-gray-400 p-2 rounded-lg w-full" rows={3} placeholder="Enter specifications" />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Attached Invoice</label>
            <input type="file" name="attached_invoice" onChange={handleChange} accept="image/*,.pdf,.doc,.docx" className="w-full border border-gray-400 p-2 rounded-lg" />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
            <input type="file" name="product_image" multiple onChange={handleChange} accept="image/*" className="w-full border border-gray-400 p-2 rounded-lg" />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Warranty Card</label>
            <input type="file" name="warranty_card" onChange={handleChange} accept="image/*,.pdf" className="w-full border border-gray-400 p-2 rounded-lg" />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-600 text-gray-600 hover:bg-gray-100">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
            {asset ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
