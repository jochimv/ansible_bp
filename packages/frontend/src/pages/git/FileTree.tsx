import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import { Folder, Description } from '@mui/icons-material';
import { useCodeChangesContext, useCodeChangesDispatchContext } from '../providers/context';
import { showDiff } from '../providers/reducer';

const buildTree = (paths: string[]) => {
  const tree = {};

  for (const path of paths) {
    const parts = path.split('\\').slice(1);
    let currentNode = tree;

    for (const part of parts) {
      if (!currentNode[part]) {
        currentNode[part] = {};
      }
      currentNode = currentNode[part];
    }
  }
  return tree;
};

const renderTree = (nodes, path: string) => {
  if (Object.keys(nodes).length === 0) {
    return;
  }

  return Object.entries(nodes).map(([nodeName, children]) => {
    const newPath = `${path}\\${nodeName}`;
    const isLeaf = Object.keys(children).length === 0;

    const dispatch = useCodeChangesDispatchContext();

    return (
      <TreeItem
        key={newPath}
        nodeId={newPath}
        label={nodeName}
        onClick={isLeaf ? () => dispatch(showDiff(newPath)) : undefined}
        icon={isLeaf ? <Description /> : <Folder />}
      >
        {renderTree(children, newPath)}
      </TreeItem>
    );
  });
};

const FileTree = () => {
  const { oldVars } = useCodeChangesContext();
  const paths = oldVars.map((oldVars) => oldVars.pathInProject);
  const treeData = buildTree(paths);

  return (
    <TreeView
      defaultCollapseIcon={<Folder open />}
      defaultExpandIcon={<Folder />}
      defaultEndIcon={<Description />}
    >
      {renderTree(treeData, '')}
    </TreeView>
  );
};

export default FileTree;
