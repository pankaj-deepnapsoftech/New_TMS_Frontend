import { useState } from 'react';
import { Plus, Pencil, Trash2, FileText, FileCheck } from 'lucide-react';
// import { useCreateAssetMutation, useDeleteAssetMutation, useGetAssetQuery, useUpdateAssetMutation } from '@/services/Asset.services';
// import { useGetAssignedTicketQuery } from '@/services/Ticket.service';

export default function AssetsPage() {
  const [openModal, setOpenModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);


  // const [ createAssetsData, {isLoading: createAssetDataLoad} ] = useCreateAssetMutation();
  // const { data: getAssetData, isLoading: getAssetDataLoad} = useGetAssignedTicketQuery();
  // const { updateAssetData, isLoading: updateAssetDataLoad } = useUpdateAssetMutation();
  // const {deleteAssetData, isLoading: deleteAssetDataLoad} = useDeleteAssetMutation();

  const [assets, setAssets] = useState([
    {
      assets_id: 'AST001',
      product_name: 'Dell Laptop',
      purchase_date: '2024-06-01',
      warranty: '2026-06-01',
      brand_name: 'Dell',
      assets_types: 'Electronics',
      specification: 'Intel',
      attached_invoice: 'invoice.pdf',
      product_image: ['/images.jpg'],
      warranty_card: 'warranty.pdf',
    },
  ]);

  const handleSave = (asset) => {
    if (editingAsset) {
      setAssets(assets.map((a) => (a.assets_id === editingAsset.assets_id ? asset : a)));
    } else {
      setAssets([...assets, asset]);
    }
    setOpenModal(false);
    setEditingAsset(null);
  };

  const handleDelete = (id) => {
    setAssets(assets.filter((a) => a.assets_id !== id));
    if (window.confirm('Are you sure you want to delete this asset?')) {
      setAssets(assets.filter((a) => a.assets_id !== id));
    }
  };

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
            {assets.map((asset) => (
              <tr key={asset.assets_id} className="hover:bg-gray-50  transition">
                <td className="px-4 py-3">{asset.assets_id}</td>
                <td className="px-4 py-3">{asset.product_name}</td>
                <td className="px-4 py-3">{asset.brand_name}</td>
                <td className="px-4 py-3">{asset.assets_types}</td>
                <td className="px-4 py-3">{asset.purchase_date}</td>
                <td className="px-4 py-3">{asset.warranty}</td>
                <td className="px-4 py-3">{asset.specification}</td>
                <td className="px-4 py-3 text-blue-600 cursor-pointer whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <FileText size={16} /> {asset.attached_invoice}
                  </div>
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {asset.product_image.map((img, i) => (
                      <img key={i} src={img} alt="asset" className="w-8 h-8 rounded object-cover border" />
                    ))}
                  </div>
                </td>

                <td className="px-4 py-3 text-green-600 cursor-pointer whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <FileCheck size={16} /> {asset.warranty_card}
                  </div>
                </td>

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
                    <button onClick={() => handleDelete(asset.assets_id)} className="p-2 text-red-500 hover:text-red-800 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
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
    </div>
  );
}

function AssetModal({ onClose, onSave, asset }) {
  const [form, setForm] = useState(
    asset || {
      assets_id: '',
      product_name: '',
      purchase_date: '',
      warranty: '',
      brand_name: '',
      assets_types: '',
      specification: '',
      attached_invoice: null,
      product_image: [],
      warranty_card: null,
    },
  );

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      if (name === 'product_image') {
        setForm({ ...form, [name]: [...files] });
      } else {
        setForm({ ...form, [name]: files[0] });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSave = () => {
    onSave(form);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{asset ? 'Edit Asset' : 'Add Asset'}</h2>

        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="assets_id" placeholder="Asset ID" value={form.assets_id} onChange={handleChange} className="border border-gray-400 p-2 rounded-lg w-full" />
          <input type="text" name="product_name" placeholder="Product Name" value={form.product_name} onChange={handleChange} className="border border-gray-400 p-2 rounded-lg w-full" />
          <input type="date" name="purchase_date" value={form.purchase_date} onChange={handleChange} className="border border-gray-400 p-2 rounded-lg w-full" />
          <input type="date" name="warranty" value={form.warranty} onChange={handleChange} className="border border-gray-400 p-2 rounded-lg w-full" />
          <input type="text" name="brand_name" placeholder="Brand Name" value={form.brand_name} onChange={handleChange} className="border border-gray-400 p-2 rounded-lg w-full" />
          <input type="text" name="assets_types" placeholder="Asset Type" value={form.assets_types} onChange={handleChange} className="border border-gray-400 p-2 rounded-lg w-full" />
          <textarea name="specification" placeholder="Specification" value={form.specification} onChange={handleChange} className="border border-gray-400 p-2 rounded-lg w-full col-span-2" rows={3} />

          {/* File upload inputs */}
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
